import { create } from "zustand"
import { subscribeWithSelector } from "zustand/middleware"
import { createDiagramSlice, DiagramSlice } from "./diagramSlice"
import ydoc from "@/sync/ydoc"
import { type Edge, type Node } from "@xyflow/react"
import { sortNodesTopologically } from "@/utils"
import {
  createDiagramMetadataSlice,
  DiagramMetadataSlice,
} from "./diagramMetadataSlice"

// Yjs maps for real-time collaboration
export const nodesMap = ydoc.getMap<Node>("nodes")
export const edgesMap = ydoc.getMap<Edge>("edges")
export const diagramMetadata = ydoc.getMap<string>("diagramMetadata")

export const useBoundStore = create<DiagramSlice & DiagramMetadataSlice>()(
  subscribeWithSelector((...a) => ({
    ...createDiagramSlice(...a),
    ...createDiagramMetadataSlice(...a),
  }))
)

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

  const updateMetaData = () => {
    useBoundStore.setState({ diagramName: diagramMetadata.get("diagramName") })
    useBoundStore.setState({ diagramType: diagramMetadata.get("diagramType") })
  }

  nodesMap.observe(updateNodes)
  edgesMap.observe(updateEdges)
  diagramMetadata.observe(updateMetaData)
}

observeYjsChanges()
