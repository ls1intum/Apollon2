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
import { generateUUID } from "@/utils" // Add this import

export type DiagramStoreData = {
  nodes: Node[]
  edges: Edge[]
}

interface ClipboardData {
  nodes: Node[]
  edges: Edge[]
  timestamp: number
}

type InitialDiagramState = {
  nodes: Node[]
  edges: Edge[]
  selectedElementIds: string[]
  diagramId: string
  assessments: Record<string, Assessment>
  canUndo: boolean
  canRedo: boolean
  undoManager: Y.UndoManager | null
}

const initialDiagramState: InitialDiagramState = {
  nodes: [],
  edges: [],
  selectedElementIds: [],
  diagramId: Math.random().toString(36).substring(2, 15),
  assessments: {},
  canUndo: false,
  canRedo: false,
  undoManager: null,
}

export type DiagramStore = {
  nodes: Node[]
  edges: Edge[]
  selectedElementIds: string[]
  diagramId: string
  assessments: Record<string, Assessment>
  canUndo: boolean
  canRedo: boolean
  undoManager: Y.UndoManager | null
  setDiagramId: (diagramId: string) => void
  setNodes: (payload: Node[] | ((nodes: Node[]) => Node[])) => void
  setEdges: (payload: Edge[] | ((edges: Edge[]) => Edge[])) => void
  setNodesAndEdges: (nodes: Node[], edges: Edge[]) => void
  addEdge: (edge: Edge) => void
  addNode: (node: Node) => void
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  reset: () => void
  setSelectedElementsId: (
    payload: string[] | ((edges: string[]) => string[])
  ) => void
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
  undo: () => void
  redo: () => void
  initializeUndoManager: () => void
  updateUndoRedoState: () => void
  // Add these copy/paste methods to the type
  copySelectedElements: () => Promise<boolean>
  pasteElements: (pasteCount?: number) => Promise<boolean> // Updated signature
  hasSelectedElements: () => boolean
  selectAll: () => void
  clearSelection: () => void
}

const PASTE_OFFSET = 20

export const createDiagramStore = (
  ydoc: Y.Doc
): UseBoundStore<StoreApi<DiagramStore>> =>
  create<DiagramStore>()(
    devtools(
      subscribeWithSelector((set, get) => ({
        ...initialDiagramState,

        initializeUndoManager: () => {
          const nodesMap = getNodesMap(ydoc)
          const edgesMap = getEdgesMap(ydoc)
          const assessmentsMap = getAssessments(ydoc)

          // Create undo manager with all the maps you want to track
          const undoManager = new Y.UndoManager(
            [nodesMap, edgesMap, assessmentsMap],
            {
              // Capture timeout - how long to wait before creating a new undo step
              captureTimeout: 500,
              // Track operations that originate from 'store'
              trackedOrigins: new Set(["store", "remote"]),
            }
          )

          // Listen to undo manager state changes
          undoManager.on("stack-item-added", () => {
            get().updateUndoRedoState()
          })

          undoManager.on("stack-item-popped", () => {
            get().updateUndoRedoState()
          })

          undoManager.on("stack-cleared", () => {
            get().updateUndoRedoState()
          })

          set({ undoManager }, undefined, "initializeUndoManager")
          get().updateUndoRedoState()
        },

        updateUndoRedoState: () => {
          const { undoManager } = get()
          if (!undoManager) return

          set(
            {
              canUndo: undoManager.undoStack.length > 0,
              canRedo: undoManager.redoStack.length > 0,
            },
            undefined,
            "updateUndoRedoState"
          )
        },

        undo: () => {
          const { undoManager } = get()
          if (!undoManager || !undoManager.canUndo()) return

          undoManager.undo()
        },

        redo: () => {
          const { undoManager } = get()
          if (!undoManager || !undoManager.canRedo()) return

          undoManager.redo()
        },

        setDiagramId: (diagramId) => {
          set({ diagramId }, undefined, "setDiagramId")
        },

        setSelectedElementsId: (payload) => {
          const selectedElementIds =
            typeof payload === "function"
              ? payload(get().selectedElementIds)
              : payload

          set({ selectedElementIds }, undefined, "setSelectedElementsId")
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

          if (selectChanges.length > 0) {
            selectChanges.forEach((change) => {
              if (change.selected) {
                set(
                  (state) => ({
                    selectedElementIds: [
                      ...state.selectedElementIds,
                      change.id,
                    ],
                  }),
                  undefined,
                  "onNodesChange-select"
                )
              } else {
                set(
                  (state) => ({
                    selectedElementIds: state.selectedElementIds.filter(
                      (id) => id !== change.id
                    ),
                  }),
                  undefined,
                  "onNodesChange-deselect"
                )
              }
              set(
                (state) => ({
                  nodes: state.nodes.map((node) =>
                    node.id === change.id
                      ? { ...node, selected: change.selected }
                      : node
                  ),
                }),
                undefined,
                "onNodesChange-select-deselect-sync"
              )
            })
          }

          // Select changes are handled previously
          const filteredChanges = changes.filter(
            (change) => change.type !== "select"
          )

          if (filteredChanges.length === 0) return
          const currentNodes = get().nodes

          const nextNodes = applyNodeChanges(filteredChanges, currentNodes)
          if (deepEqual(currentNodes, nextNodes)) {
            return
          }

          ydoc.transact(() => {
            for (const change of filteredChanges) {
              if (change.type === "add" || change.type === "replace") {
                getNodesMap(ydoc).set(change.item.id, change.item)
              } else if (change.type === "remove") {
                set(
                  (state) => ({
                    selectedElementIds: state.selectedElementIds.filter(
                      (id) => id !== change.id
                    ),
                  }),
                  undefined,
                  "onNodesChange-remove-selectedElementIds"
                )
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
          const selectChanges = changes.filter(
            (change) => change.type === "select"
          )
          if (selectChanges.length > 0) {
            selectChanges.forEach((change) => {
              if (change.selected) {
                set(
                  (state) => ({
                    selectedElementIds: [
                      ...state.selectedElementIds,
                      change.id,
                    ],
                  }),
                  undefined,
                  "onEdgesChange-select"
                )
              } else {
                set(
                  (state) => ({
                    selectedElementIds: state.selectedElementIds.filter(
                      (id) => id !== change.id
                    ),
                  }),
                  undefined,
                  "onEdgesChange-deselect"
                )
              }
              set(
                (state) => ({
                  edges: state.edges.map((edge) =>
                    edge.id === change.id
                      ? { ...edge, selected: change.selected }
                      : edge
                  ),
                }),
                undefined,
                "onEdgesChange-select-deselect-sync"
              )
            })
          }

          const changesWithoutSelect = changes.filter(
            (change) => change.type !== "select"
          )

          if (changesWithoutSelect.length === 0) return

          const currentEdges = get().edges
          const nextEdges = applyEdgeChanges(changesWithoutSelect, currentEdges)
          if (deepEqual(currentEdges, nextEdges)) {
            return
          }

          ydoc.transact(() => {
            for (const change of changes) {
              if (change.type === "add" || change.type === "replace") {
                getEdgesMap(ydoc).set(change.item.id, change.item)
              } else if (change.type === "remove") {
                set(
                  (state) => ({
                    selectedElementIds: state.selectedElementIds.filter(
                      (id) => id !== change.id
                    ),
                  }),
                  undefined,
                  "onEdgesChange-remove"
                )
                getEdgesMap(ydoc).delete(change.id)
              }
            }
          }, "store")
          set({ edges: nextEdges }, undefined, "onEdgesChange")
        },

        reset: () => {
          const { undoManager } = get()
          if (undoManager) {
            undoManager.clear()
          }
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

          // Find removed nodes that are not in the Yjs document
          // and remove them from the selectedElementIds
          // This is necessary to keep the selection in sync with the Yjs document
          // and to avoid selecting nodes that are no longer present in state
          const removedNodes = get().nodes.filter(
            (node) =>
              !preserveSelectedNodesAfterYdoc.some((n) => n.id === node.id)
          )
          if (removedNodes.length > 0) {
            set(
              (state) => ({
                selectedElementIds: state.selectedElementIds.filter(
                  (id) =>
                    !removedNodes.some((removedNode) => removedNode.id === id)
                ),
              }),
              undefined,
              "updateNodesFromYjs-selection-remove"
            )
          }

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

          // Find removed edges that are not in the Yjs document
          // and remove them from the selectedElementIds
          // This is necessary to keep the selection in sync with the Yjs document
          // and to avoid selecting edges that are no longer present in state
          const removedEdges = get().edges.filter(
            (edge) =>
              !preserveSelectedEdgesAfterYdoc.some((e) => e.id === edge.id)
          )
          if (removedEdges.length > 0) {
            set(
              (state) => ({
                selectedElementIds: state.selectedElementIds.filter(
                  (id) =>
                    !removedEdges.some((removedEdge) => removedEdge.id === id)
                ),
              }),
              undefined,
              "updateEdgesFromYjs-selection-remove"
            )
          }

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

        copySelectedElements: async () => {
          const { selectedElementIds, nodes, edges } = get()
          
          if (selectedElementIds.length === 0) {
            return false
          }

          const selectedNodes = nodes.filter(node => selectedElementIds.includes(node.id))
          const selectedEdges = edges.filter(edge => selectedElementIds.includes(edge.id))
          
     
          const connectedEdges = edges.filter(edge => 
            selectedElementIds.includes(edge.source) && selectedElementIds.includes(edge.target)
          )
          
          const allRelevantEdges = [...selectedEdges]
          connectedEdges.forEach(edge => {
            if (!allRelevantEdges.some(e => e.id === edge.id)) {
              allRelevantEdges.push(edge)
            }
          })

          const clipboardData: ClipboardData = {
            nodes: selectedNodes,
            edges: allRelevantEdges,
            timestamp: Date.now()
          }

          try {
            const jsonString = JSON.stringify(clipboardData)
            if (navigator.clipboard && window.isSecureContext) {
              await navigator.clipboard.writeText(jsonString)
              return true
            }
          } catch (error) {
            console.error('Failed to copy to clipboard:', error)
            return false
          }
          
          return false
        },

        pasteElements: async (pasteCount: number = 1) => {
          try {
            let text: string
            if (navigator.clipboard && window.isSecureContext) {
              text = await navigator.clipboard.readText()
            } else {
              return false
            }
            
            const clipboardData = JSON.parse(text) as ClipboardData
            
            if (!clipboardData || !Array.isArray(clipboardData.nodes) || !Array.isArray(clipboardData.edges)) {
              return false
            }

            const nodeIdMap = new Map<string, string>()
            const newElementIds: string[] = []
            const progressiveOffset = PASTE_OFFSET * pasteCount
            const pastedNodes = clipboardData.nodes.map((node: Node) => {
              const newId = generateUUID()
              nodeIdMap.set(node.id, newId)
              newElementIds.push(newId)

              const newNode = {
                ...node,
                id: newId,
                position: {
                  x: node.position.x + progressiveOffset,
                  y: node.position.y + progressiveOffset
                },
                selected: true,
              }

              return newNode
            })

    
            const pastedEdges = clipboardData.edges
              .filter((edge: Edge) => {
                return nodeIdMap.has(edge.source) && nodeIdMap.has(edge.target)
              })
              .map((edge: Edge) => {
                const newId = generateUUID()
                newElementIds.push(newId)

                const newEdge = {
                  ...edge,
                  id: newId,
                  source: nodeIdMap.get(edge.source)!,
                  target: nodeIdMap.get(edge.target)!,
                  selected: true,
                }

                return newEdge
              })
            ydoc.transact(() => {
              pastedNodes.forEach(node => getNodesMap(ydoc).set(node.id, node))
              pastedEdges.forEach(edge => getEdgesMap(ydoc).set(edge.id, edge))
            }, "store")

            set(
              (state) => ({
                nodes: [...state.nodes, ...pastedNodes],
                edges: [...state.edges, ...pastedEdges],
                selectedElementIds: newElementIds
              }),
              undefined,
              "pasteElements"
            )

            return true
          } catch (error) {
            console.error('Failed to paste from clipboard:', error)
            return false
          }
        },

        hasSelectedElements: () => {
          return get().selectedElementIds.length > 0
        },

        selectAll: () => {
          const { nodes, edges } = get()
          const allElementIds = [
            ...nodes.map(node => node.id),
            ...edges.map(edge => edge.id)
          ]
          
          set(
            (state) => ({
              selectedElementIds: allElementIds,
              nodes: state.nodes.map(node => ({ ...node, selected: true })),
              edges: state.edges.map(edge => ({ ...edge, selected: true })),
            }),
            undefined,
            "selectAll"
          )
        },

        clearSelection: () => {
          set(
            (state) => ({
              selectedElementIds: [],
              nodes: state.nodes.map(node => ({ ...node, selected: false })),
              edges: state.edges.map(edge => ({ ...edge, selected: false })),
            }),
            undefined,
            "clearSelection"
          )
        },

      })),
      { name: "DiagramStore", enabled: true }
    )
  )
