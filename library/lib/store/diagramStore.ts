import { create, StoreApi, UseBoundStore } from "zustand"
import { devtools, subscribeWithSelector } from "zustand/middleware"
import {
  applyNodeChanges,
  getConnectedEdges,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  applyEdgeChanges,
} from "@xyflow/react"
import * as Y from "yjs"
import { sortNodesTopologically } from "@/utils"
import { getNodesMap, getEdgesMap, getAssessments } from "@/sync/ydoc"
import { deepEqual } from "@/utils/storeUtils"
import { Assessment } from "@/typings"

export type DiagramStoreData = {
  nodes: Node[]
  edges: Edge[]
}

type InitialDiagramState = {
  nodes: Node[]
  edges: Edge[]
  interactiveElementId: string | null
  diagramId: string
  assessments: Record<string, Assessment>
}

const initialDiagramState: InitialDiagramState = {
  nodes: [],
  edges: [],
  interactiveElementId: null,
  diagramId: Math.random().toString(36).substring(2, 15),
  assessments: {},
}

export type DiagramStore = {
  nodes: Node[]
  edges: Edge[]
  interactiveElementId: string | null
  diagramId: string
  assessments: Record<string, Assessment>
  setDiagramId: (diagramId: string) => void
  setNodes: (payload: Node[] | ((nodes: Node[]) => Node[])) => void
  setEdges: (payload: Edge[] | ((edges: Edge[]) => Edge[])) => void
  setNodesAndEdges: (nodes: Node[], edges: Edge[]) => void
  addEdge: (edge: Edge) => void
  addNode: (node: Node) => void
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  reset: () => void
  setInteractiveElementId: (elementId: string | null) => void
  getAssessment: (id: string) => Assessment | undefined
  setAssessments: (
    assessments:
      | Record<string, Assessment>
      | ((prev: Record<string, Assessment>) => Record<string, Assessment>)
  ) => void
  updateNodesFromYjs: () => void
  updateEdgesFromYjs: () => void
  updateAssessmentFromYjs: () => void
  addOrUpdateAssessment: (assessment: Assessment) => void
}

export const createDiagramStore = (
  ydoc: Y.Doc
): UseBoundStore<StoreApi<DiagramStore>> =>
  create<DiagramStore>()(
    devtools(
      subscribeWithSelector((set, get) => ({
        ...initialDiagramState,
        setDiagramId: (diagramId) => {
          set({ diagramId }, undefined, "setDiagramId")
        },
        setInteractiveElementId: (interactiveElementId) => {
          set({ interactiveElementId }, undefined, "setInteractiveElementId")
        },

        addNode: (node) => {
          ydoc.transact(() => {
            getNodesMap(ydoc).set(node.id, node)
          }, "store")
          set({ nodes: [...get().nodes, node] }, undefined, "addNode")
        },

        addEdge: (edge) => {
          ydoc.transact(() => {
            getEdgesMap(ydoc).set(edge.id, edge)
          }, "store")
          set({ edges: [...get().edges, edge] }, undefined, "addEdge")
        },

        setNodes: (payload) => {
          const nodes =
            typeof payload === "function" ? payload(get().nodes) : payload

          if (deepEqual(get().nodes, nodes)) {
            return
          }

          ydoc.transact(() => {
            getNodesMap(ydoc).clear()
            nodes.forEach((node) => getNodesMap(ydoc).set(node.id, node))
          }, "store")
          set({ nodes }, undefined, "setNodes")
        },

        setEdges: (payload) => {
          const edges =
            typeof payload === "function" ? payload(get().edges) : payload

          if (deepEqual(get().edges, edges)) {
            return
          }
          ydoc.transact(() => {
            getEdgesMap(ydoc).clear()
            edges.forEach((edge) => getEdgesMap(ydoc).set(edge.id, edge))
          }, "store")
          set({ edges }, undefined, "setEdges")
        },

        setNodesAndEdges: (nodes, edges) => {
          ydoc.transact(() => {
            getNodesMap(ydoc).clear()
            getEdgesMap(ydoc).clear()
            nodes.forEach((node) => getNodesMap(ydoc).set(node.id, node))
            edges.forEach((edge) => getEdgesMap(ydoc).set(edge.id, edge))
          }, "store")
          set({ nodes, edges }, undefined, "setNodesAndEdges")
        },

        onNodesChange: (changes) => {
          const selectChanges = changes.filter(
            (change) => change.type === "select"
          )
          const currentNodes = get().nodes

          if (selectChanges.length > 0) {
            const updatedNodesBySelection = applyNodeChanges(
              selectChanges,
              currentNodes
            )

            const isNodesArrayEqualAfterAppliedChanges = deepEqual(
              currentNodes,
              updatedNodesBySelection
            )

            if (!isNodesArrayEqualAfterAppliedChanges) {
              set(
                { nodes: updatedNodesBySelection },
                undefined,
                "onNodesChangeSelect updatedNodesBySelection"
              )
              const selectedNodes = updatedNodesBySelection.filter(
                (node) => node.selected
              )
              if (selectedNodes.length === 1 && selectedNodes[0].selected) {
                set(
                  { interactiveElementId: selectedNodes[0].id },
                  undefined,
                  "onNodesChangeSelect interactiveElementId"
                )
              }
            }
            if (
              updatedNodesBySelection.reduce(
                (acc, node) => acc + (node.selected ? 1 : 0),
                0
              ) > 1
            ) {
              set(
                { interactiveElementId: null },
                undefined,
                "onNodesChangeSelect interactiveElementId reset"
              )
            }
          }

          const filteredChanges = changes.filter(
            (change) =>
              !(
                change.type === "select" ||
                (change.type === "position" && !change.dragging)
              )
          )

          if (filteredChanges.length === 0) return
          const nextNodes = applyNodeChanges(filteredChanges, currentNodes)
          if (deepEqual(currentNodes, nextNodes)) {
            return
          }

          ydoc.transact(() => {
            for (const change of filteredChanges) {
              if (change.type === "add" || change.type === "replace") {
                getNodesMap(ydoc).set(change.item.id, change.item)
              } else if (change.type === "remove") {
                const deletedNode = getNodesMap(ydoc).get(change.id)
                if (deletedNode) {
                  const connectedEdges = getConnectedEdges(
                    [deletedNode],
                    get().edges
                  )
                  getNodesMap(ydoc).delete(change.id)
                  connectedEdges.forEach((edge) =>
                    getEdgesMap(ydoc).delete(edge.id)
                  )
                }
              } else {
                const node = nextNodes.find((n) => n.id === change.id)
                if (node) getNodesMap(ydoc).set(change.id, node)
              }
            }
          }, "store")
          set({ nodes: nextNodes }, undefined, "onNodesChange")
        },

        onEdgesChange: (changes) => {
          const changesWithoutSelect = changes.filter(
            (change) => change.type !== "select"
          )

          if (changesWithoutSelect.length === 0) return

          const currentEdges = get().edges
          const nextEdges = applyEdgeChanges(changesWithoutSelect, currentEdges)
          if (deepEqual(currentEdges, nextEdges)) return

          ydoc.transact(() => {
            for (const change of changes) {
              if (change.type === "add" || change.type === "replace") {
                getEdgesMap(ydoc).set(change.item.id, change.item)
              } else if (change.type === "remove") {
                getEdgesMap(ydoc).delete(change.id)
              }
            }
          }, "store")
          set({ edges: nextEdges }, undefined, "onEdgesChange")
        },

        reset: () => {
          set(initialDiagramState, undefined, "reset")
        },

        updateNodesFromYjs: () => {
          const preserveSelectedNodesAfterYdoc = sortNodesTopologically(
            Array.from(getNodesMap(ydoc).values())
          ).map((node) => {
            const currentNode = get().nodes.find((n) => n.id === node.id)
            if (currentNode) {
              return { ...node, selected: currentNode.selected }
            } else {
              return node
            }
          })

          set(
            {
              nodes: preserveSelectedNodesAfterYdoc,
            },
            undefined,
            "updateNodesFromYjs"
          )
        },

        updateEdgesFromYjs: () => {
          const preserveSelectedEdgesAfterYdoc = Array.from(
            getEdgesMap(ydoc).values()
          ).map((edge) => {
            const currentEdge = get().edges.find((e) => e.id === edge.id)
            if (currentEdge) {
              return { ...edge, selected: currentEdge.selected }
            } else {
              return edge
            }
          })
          set(
            { edges: preserveSelectedEdgesAfterYdoc },
            undefined,
            "updateEdgesFromYjs"
          )
        },
        setAssessments: (payload) => {
          const assessments =
            typeof payload === "function" ? payload(get().assessments) : payload

          ydoc.transact(() => {
            const yMap = getAssessments(ydoc)
            yMap.clear()
            Object.entries(assessments).forEach(([id, assessment]) => {
              yMap.set(id, assessment)
            })
          }, "store")

          set({ assessments }, undefined, "setAssessments")
        },
        updateAssessmentFromYjs: () => {
          const yMap = getAssessments(ydoc)
          const assessments: Record<string, Assessment> = {}

          yMap.forEach((value, key) => {
            assessments[key] = value
          })

          set({ assessments }, undefined, "updateAssessmentFromYjs")
        },
        getAssessment: (id) => {
          return get().assessments[id]
        },

        addOrUpdateAssessment: (assessment) => {
          ydoc.transact(() => {
            getAssessments(ydoc).set(assessment.modelElementId, assessment)
          }, "store")
          set(
            (state) => ({
              assessments: {
                ...state.assessments,
                [assessment.modelElementId]: assessment,
              },
            }),
            undefined,
            "addOrUpdateAssessment"
          )
        },
      })),
      { name: "DiagramStore", enabled: true }
    )
  )
