import { type Edge } from "@xyflow/react"
import { DiagramElementNodeType } from "./nodes"

export const defaultNodes: DiagramElementNodeType[] = [
  {
    id: "1",
    type: "diagramElementNode",
    position: { x: 300, y: 100 },
    style: { width: 200, height: 200 },
    selected: false,
    data: {
      type: "package",
      color: "purple",
    },
  },
  {
    id: "2",
    type: "diagramElementNode",
    position: { x: 300, y: 450 },
    style: { width: 296, height: 170 },
    selected: false,
    data: {
      type: "class",
    },
  },
]

export const defaultEdges: Edge[] = [
  {
    id: "1->2",
    source: "1",
    target: "2",
    sourceHandle: "bottom",
    targetHandle: "top",
  },
]
