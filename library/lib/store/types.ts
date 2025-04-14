import {
  type Edge,
  type Node,
  type OnNodesChange,
  type OnEdgesChange,
} from "@xyflow/react"
import { DiagramType } from "@/types"

export type DiagramStoreData = {
  nodes: Node[]
  edges: Edge[]
}

export type DiagramStore = {
  nodes: Node[]
  edges: Edge[]
  setNodes: (payload: Node[] | ((nodes: Node[]) => Node[])) => void
  setEdges: (payload: Edge[] | ((edges: Edge[]) => Edge[])) => void
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

export type MetadataStore = {
  diagramName: string
  diagramType: DiagramType
  updateDiagramName: (name: string) => void
  updateDiagramType: (type: DiagramType) => void
  updateMetaDataFromYjs: () => void
}
