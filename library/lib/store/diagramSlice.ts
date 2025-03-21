import { StateCreator } from "zustand"
import {
  type Node,
  type Edge,
  applyNodeChanges,
  getConnectedEdges,
  type OnNodesChange,
  type OnEdgesChange,
  applyEdgeChanges,
} from "@xyflow/react"

import { edgesMap, nodesMap } from "."

export type DiagramStoreData = {
  nodes: Node[]
  edges: Edge[]
}
export interface DiagramSlice {
  nodes: Node[]
  edges: Edge[]
  setNodes: (nodes: Node[]) => void
  setEdges: (edges: Edge[]) => void
  addEdge: (edge: Edge) => void
  addNode: (node: Node) => void
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  reset: () => void
}

export const createDiagramSlice: StateCreator<DiagramSlice> = (set) => ({
  nodes: Array.from(nodesMap.values()),
  edges: Array.from(edgesMap.values()),

  addEdge: (edge) => {
    edgesMap.set(edge.id, edge)
  },
  addNode: (node) => {
    nodesMap.set(node.id, node)
  },
  setNodes: (nodes) => {
    const seen = new Set<string>()

    nodes.forEach((node) => {
      seen.add(node.id)
      nodesMap.set(node.id, node)
    })

    // Remove nodes that no longer exist
    for (const node of nodesMap.values()) {
      if (!seen.has(node.id)) {
        nodesMap.delete(node.id)
      }
    }
  },

  setEdges: (edges) => {
    const seen = new Set<string>()

    edges.forEach((edge) => {
      seen.add(edge.id)
      edgesMap.set(edge.id, edge)
    })

    for (const edge of edgesMap.values()) {
      if (!seen.has(edge.id)) {
        edgesMap.delete(edge.id)
      }
    }
  },

  onNodesChange: (changes) => {
    const currentNodes = Array.from(nodesMap.values())
    const nextNodes = applyNodeChanges(changes, currentNodes)

    for (const change of changes) {
      if (change.type === "add" || change.type === "replace") {
        nodesMap.set(change.item.id, change.item)
      } else if (change.type === "remove" && nodesMap.has(change.id)) {
        const deletedNode = nodesMap.get(change.id)
        if (deletedNode) {
          const connectedEdges = getConnectedEdges(
            [deletedNode],
            [...edgesMap.values()]
          )
          nodesMap.delete(change.id)

          for (const edge of connectedEdges) {
            edgesMap.delete(edge.id)
          }
        }
      } else {
        const node = nextNodes.find((n) => n.id === change.id)
        if (node) {
          nodesMap.set(change.id, node)
        }
      }
    }
  },

  onEdgesChange: (changes) => {
    const edges = Array.from(edgesMap.values())
    const nextEdges = applyEdgeChanges(changes, edges)

    for (const change of changes) {
      if (change.type === "add" || change.type === "replace") {
        edgesMap.set(change.item.id, change.item)
      } else if (change.type === "remove" && edgesMap.has(change.id)) {
        edgesMap.delete(change.id)
      } else {
        const edge = nextEdges.find((n) => n.id === change.id)
        if (edge) {
          edgesMap.set(change.id, edge)
        } else {
          console.warn(`Edge with id ${change.id} not found in nextEdges.`)
        }
      }
    }
  },

  reset: () => {
    nodesMap.clear()
    edgesMap.clear()
    set({ nodes: [], edges: [] })
  },
})
