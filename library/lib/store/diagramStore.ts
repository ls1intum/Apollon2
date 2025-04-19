import { create, StoreApi, UseBoundStore } from "zustand"
import { devtools, subscribeWithSelector } from "zustand/middleware"
import {
  applyNodeChanges,
  applyEdgeChanges,
  getConnectedEdges,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
} from "@xyflow/react"
import { nodesMap, edgesMap } from "./constants"

import { sortNodesTopologically } from "@/utils"
import ydoc from "@/sync/ydoc"

export type DiagramStoreData = {
  nodes: Node[]
  edges: Edge[]
}

export type DiagramStore = {
  nodes: Node[]
  edges: Edge[]
  setNodes: (payload: Node[] | ((nodes: Node[]) => Node[])) => void
  setEdges: (payload: Edge[] | ((edges: Edge[]) => Edge[])) => void
  setNodesAndEdges: (nodes: Node[], edges: Edge[]) => void
  addEdge: (edge: Edge) => void
  addNode: (node: Node) => void
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  reset: () => void
  interactiveElementId: string | null
  setInteractiveElementId: (elementId: string | null) => void
  updateNodesFromYjs: () => void
  updateEdgesFromYjs: () => void
}

export const createDiagramStore = (): UseBoundStore<StoreApi<DiagramStore>> =>
  create<DiagramStore>()(
    devtools(
      subscribeWithSelector((set, get) => ({
        nodes: Array.from(nodesMap.values()),
        edges: Array.from(edgesMap.values()),
        interactiveElementId: null,

        setInteractiveElementId: (interactiveElementId) =>
          set({ interactiveElementId }, undefined, "setInteractiveElementId"),

        addNode: (node) => {
          nodesMap.set(node.id, node)
        },

        addEdge: (edge) => {
          edgesMap.set(edge.id, edge)
        },

        setNodes: (payload) => {
          const nodes =
            typeof payload === "function" ? payload(get().nodes) : payload

          // Batch Yjs updates in a transaction
          ydoc.transact(() => {
            nodesMap.clear()
            nodes.forEach((node) => nodesMap.set(node.id, node))
          }, "store")

          set({ nodes }, undefined, "setNodes")
        },

        setEdges: (payload) => {
          const edges =
            typeof payload === "function" ? payload(get().edges) : payload

          // Batch Yjs updates in a transaction
          ydoc.transact(() => {
            edgesMap.clear()
            edges.forEach((edge) => edgesMap.set(edge.id, edge))
          }, "store")

          set({ edges }, undefined, "setEdges")
        },

        setNodesAndEdges: (nodes, edges) => {
          // Batch Yjs updates in a transaction
          ydoc.transact(() => {
            nodesMap.clear()
            edgesMap.clear()
            nodes.forEach((node) => nodesMap.set(node.id, node))
            edges.forEach((edge) => edgesMap.set(edge.id, edge))
          }, "store")
          set({ nodes, edges }, undefined, "setNodesAndEdges")
        },
        // Set nodes and edges from Yjs

        onNodesChange: (changes) => {
          const currentNodes = get().nodes
          const nextNodes = applyNodeChanges(changes, currentNodes)

          // Batch Yjs updates for node changes
          ydoc.transact(() => {
            for (const change of changes) {
              if (change.type === "add" || change.type === "replace") {
                nodesMap.set(change.item.id, change.item)
              } else if (change.type === "remove") {
                const deletedNode = nodesMap.get(change.id)
                if (deletedNode) {
                  const connectedEdges = getConnectedEdges(
                    [deletedNode],
                    get().edges
                  )
                  nodesMap.delete(change.id)
                  connectedEdges.forEach((edge) => edgesMap.delete(edge.id))
                }
              } else {
                const node = nextNodes.find((n) => n.id === change.id)
                if (node) nodesMap.set(change.id, node)
              }
            }
          }, "store")

          set({ nodes: nextNodes }, undefined, "onNodesChange")
        },

        onEdgesChange: (changes) => {
          const currentEdges = get().edges
          const nextEdges = applyEdgeChanges(changes, currentEdges)

          // Batch Yjs updates for edge changes
          ydoc.transact(() => {
            for (const change of changes) {
              if (change.type === "add" || change.type === "replace") {
                edgesMap.set(change.item.id, change.item)
              } else if (change.type === "remove") {
                edgesMap.delete(change.id)
              } else {
                const edge = nextEdges.find((e) => e.id === change.id)
                if (edge) edgesMap.set(edge.id, edge)
              }
            }
          }, "store")

          set({ edges: nextEdges }, undefined, "onEdgesChange")
        },

        reset: () => {
          ydoc.transact(() => {
            nodesMap.clear()
            edgesMap.clear()
          }, "store")
          set({ nodes: [], edges: [] }, undefined, "reset")
        },

        updateNodesFromYjs: () =>
          set(
            { nodes: sortNodesTopologically(Array.from(nodesMap.values())) },
            undefined,
            "updateNodesFromYjs"
          ),

        updateEdgesFromYjs: () =>
          set(
            { edges: Array.from(edgesMap.values()) },
            undefined,
            "updateEdgesFromYjs"
          ),
      })),
      { name: "DiagramStore", enabled: true }
    )
  )
