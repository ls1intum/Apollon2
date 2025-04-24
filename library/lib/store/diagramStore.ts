/* eslint-disable @typescript-eslint/no-explicit-any */
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

import { sortNodesTopologically } from "@/utils"
import { getEdgesMap, getNodesMap, getYDoc } from "@/sync/ydoc"

export type DiagramStoreData = {
  nodes: Node[]
  edges: Edge[]
}

type InitialDiagramState = {
  nodes: Node[]
  edges: Edge[]
  interactiveElementId: string | null
}

const initialDiagramState: InitialDiagramState = {
  nodes: [],
  edges: [],
  interactiveElementId: null,
}

export type DiagramStore = {
  nodes: Node[]
  edges: Edge[]
  interactiveElementId: string | null
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

export const createDiagramStore = (): UseBoundStore<StoreApi<DiagramStore>> =>
  create<DiagramStore>()(
    devtools(
      subscribeWithSelector((set, get) => ({
        ...initialDiagramState,

        setInteractiveElementId: (interactiveElementId) => {
          set(
            {
              nodes: get().nodes.map((node) => {
                if (node.id === interactiveElementId) {
                  return {
                    ...node,
                    selected: true,
                  }
                }
                return {
                  ...node,
                  selected: false,
                }
              }),
            },
            undefined,
            "setInteractiveElementId"
          )
          set({ interactiveElementId }, undefined, "setInteractiveElementId")
        },

        addNode: (node) => {
          getYDoc().transact(() => {
            getNodesMap().set(node.id, node)
          }, "store")
        },

        addEdge: (edge) => {
          getYDoc().transact(() => {
            getEdgesMap().set(edge.id, edge)
          }, "store")
        },

        setNodes: (payload) => {
          const nodes =
            typeof payload === "function" ? payload(get().nodes) : payload

          // Batch Yjs updates in a transaction
          getYDoc().transact(() => {
            getNodesMap().clear()
            nodes.forEach((node) => getNodesMap().set(node.id, node))
          }, "store")
          set({ nodes }, undefined, "setNodes")
        },

        setEdges: (payload) => {
          const edges =
            typeof payload === "function" ? payload(get().edges) : payload

          // Batch Yjs updates in a transaction
          getYDoc().transact(() => {
            getEdgesMap().clear()
            edges.forEach((edge) => getEdgesMap().set(edge.id, edge))
          }, "store")

          set({ edges }, undefined, "setEdges")
        },

        setNodesAndEdges: (nodes, edges) => {
          // Batch Yjs updates in a transaction
          getYDoc().transact(() => {
            getNodesMap().clear()
            getEdgesMap().clear()
            nodes.forEach((node) => getNodesMap().set(node.id, node))
            edges.forEach((edge) => getEdgesMap().set(edge.id, edge))
          }, "store")
          set({ nodes, edges }, undefined, "setNodesAndEdges")
        },

        onNodesChange: (changes) => {
          const changesWithoutSelect = changes.filter(
            (change) => change.type !== "select"
          )

          if (changesWithoutSelect.length === 0) {
            return
          }
          const currentNodes = get().nodes
          const nextNodes = applyNodeChanges(changes, currentNodes)

          if (deepEqual(currentNodes, nextNodes)) {
            return
          }

          getYDoc().transact(() => {
            // Select changes are handled with interactiveElementId
            for (const change of changesWithoutSelect) {
              if (change.type === "add" || change.type === "replace") {
                getNodesMap().set(change.item.id, change.item)
              } else if (change.type === "remove") {
                const deletedNode = getNodesMap().get(change.id)
                if (deletedNode) {
                  const connectedEdges = getConnectedEdges(
                    [deletedNode],
                    get().edges
                  )
                  getNodesMap().delete(change.id)
                  connectedEdges.forEach((edge) =>
                    getEdgesMap().delete(edge.id)
                  )
                }
              } else {
                const node = nextNodes.find((n) => n.id === change.id)
                if (node) getNodesMap().set(change.id, node)
              }
            }
          }, "store")

          set({ nodes: nextNodes }, undefined, "onNodesChange")
        },

        onEdgesChange: (changes) => {
          const changesWithoutSelect = changes.filter(
            (change) => change.type !== "select"
          )

          if (changesWithoutSelect.length === 0) {
            return
          }
          const currentEdges = get().edges
          const nextEdges = applyEdgeChanges(changes, currentEdges)

          if (deepEqual(currentEdges, nextEdges)) {
            return
          }

          getYDoc().transact(() => {
            for (const change of changes) {
              if (change.type === "add" || change.type === "replace") {
                getEdgesMap().set(change.item.id, change.item)
              } else if (change.type === "remove") {
                getEdgesMap().delete(change.id)
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
              nodes: sortNodesTopologically(Array.from(getNodesMap().values())),
            },
            undefined,
            "updateNodesFromYjs"
          )
        },

        updateEdgesFromYjs: () =>
          set(
            { edges: Array.from(getEdgesMap().values()) },
            undefined,
            "updateEdgesFromYjs"
          ),
      })),
      { name: "DiagramStore", enabled: true }
    )
  )

function deepEqual(a: any, b: any) {
  if (a === b) return true

  if (
    a == null ||
    typeof a !== "object" ||
    b == null ||
    typeof b !== "object"
  ) {
    return false
  }

  // Handle arrays
  if (Array.isArray(a) !== Array.isArray(b)) return false

  const keysA = Object.keys(a)
  const keysB = Object.keys(b)

  if (keysA.length !== keysB.length) return false

  for (const key of keysA) {
    if (!keysB.includes(key)) return false
    if (!deepEqual(a[key], b[key])) return false
  }

  return true
}
