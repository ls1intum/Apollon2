import { Node, Edge } from "@xyflow/react"
import * as Y from "yjs"

// Utility functions that accept a Y.Doc instance
export const getNodesMap = (ydoc: Y.Doc) => ydoc.getMap<Node>("nodes")
export const getEdgesMap = (ydoc: Y.Doc) => ydoc.getMap<Edge>("edges")
export const getDiagramMetadata = (ydoc: Y.Doc) =>
  ydoc.getMap<string>("diagramMetadata")
