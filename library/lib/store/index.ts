import { create } from "zustand"
import { createDiagramSlice, DiagramSlice } from "./diagramSlice"
import ydoc from "@/sync/ydoc"
import { type Edge, type Node } from "@xyflow/react"
import { sortNodesTopologically } from "@/utils"

// Yjs maps for real-time collaboration
export const nodesMap = ydoc.getMap<Node>("nodes")
export const edgesMap = ydoc.getMap<Edge>("edges")

export const useBoundStore = create<DiagramSlice>()((...a) => ({
  ...createDiagramSlice(...a),
}))

// Sync Zustand store with Yjs changes
const observeYjsChanges = () => {
  const updateNodes = () => {
    useBoundStore.setState({
      nodes: sortNodesTopologically(Array.from(nodesMap.values())),
    })
  }

  const updateEdges = () => {
    useBoundStore.setState({ edges: Array.from(edgesMap.values()) })
  }

  nodesMap.observe(updateNodes)
  edgesMap.observe(updateEdges)

  updateNodes()
  updateEdges()
}

observeYjsChanges()
