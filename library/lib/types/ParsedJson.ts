import { type Edge, type Node } from "@xyflow/react"
import { DiagramType } from "./DiagramType"

export type ParsedJSON = {
  version: string
  title: string
  diagramType: DiagramType
  nodes: Node[]
  edges: Edge[]
}
