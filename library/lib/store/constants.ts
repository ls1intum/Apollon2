import ydoc from "@/sync/ydoc"
import { Node, Edge } from "@xyflow/react"

export const nodesMap = ydoc.getMap<Node>("nodes")
export const edgesMap = ydoc.getMap<Edge>("edges")
export const diagramMetadata = ydoc.getMap<string>("diagramMetadata")
