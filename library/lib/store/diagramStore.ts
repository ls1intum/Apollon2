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
import { getNodesMap, getEdgesMap } from "@/sync/ydoc"
import { deepEqual } from "@/utils/storeUtils"

export type DiagramStoreData = {
  nodes: Node[]
  edges: Edge[]
}

type InitialDiagramState = {
  nodes: Node[]
  edges: Edge[]
  interactiveElementId: string | null
  diagramId: string
}

const initialDiagramState: InitialDiagramState = {
  nodes: [],
  edges: [],
  interactiveElementId: null,
  diagramId: Math.random().toString(36).substring(2, 15),
}

export type DiagramStore = {
  nodes: Node[]
  edges: Edge[]
  interactiveElementId: string | null
  diagramId: string
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
  updateNodesFromYjs: () => void
  updateEdgesFromYjs: () => void
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
          ydoc.transact(() => {
            getNodesMap(ydoc).clear()
            nodes.forEach((node) => getNodesMap(ydoc).set(node.id, node))
          }, "store")
          set({ nodes }, undefined, "setNodes")
        },

        setEdges: (payload) => {
          const edges =
            typeof payload === "function" ? payload(get().edges) : payload
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
          const changesWithoutSelect = changes.filter(
            (change) => change.type !== "select"
          )

          if (changesWithoutSelect.length === 0) return

          const currentNodes = get().nodes
          const nextNodes = applyNodeChanges(changesWithoutSelect, currentNodes)
          if (deepEqual(currentNodes, nextNodes)) {
            return
          }

          ydoc.transact(() => {
            for (const change of changesWithoutSelect) {
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
              } else if (change.type === "position" && !change.dragging) {
                // This change happens when user clicks on a node
                continue
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
          set(
            {
              nodes: sortNodesTopologically(
                Array.from(getNodesMap(ydoc).values())
              ),
            },
            undefined,
            "updateNodesFromYjs"
          )
        },

        updateEdgesFromYjs: () => {
          set(
            { edges: Array.from(getEdgesMap(ydoc).values()) },
            undefined,
            "updateEdgesFromYjs"
          )
        },
      })),
      { name: "DiagramStore", enabled: true }
    )
  )
