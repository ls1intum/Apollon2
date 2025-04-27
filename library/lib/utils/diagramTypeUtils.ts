import { DiagramType } from "@/types"
import { ApollonEdge, ApollonNode } from "@/types/EditorOptions"
import { type Node, type Edge } from "@xyflow/react"
const diagramTypeValues = new Set(Object.values(DiagramType))

const isDiagramType = (value: unknown): value is DiagramType => {
  return diagramTypeValues.has(value as DiagramType)
}

export const parseDiagramType = (
  value: unknown,
  fallback: DiagramType = DiagramType.ClassDiagram
): DiagramType => {
  return isDiagramType(value) ? value : fallback
}

export const mapFromReactFlowNodeToApollonNode = (node: Node): ApollonNode => {
  return {
    id: node.id,
    width: node.width ?? 0,
    height: node.height ?? 0,
    type: node.type ?? "",
    position: {
      x: node.position.x,
      y: node.position.y,
    },
    data: node.data,
    measured: {
      width: node.measured?.width ?? 0,
      height: node.measured?.height ?? 0,
    },
  }
}

export const mapFromReactFlowEdgeToApollonEdge = (edge: Edge): ApollonEdge => {
  return {
    id: edge.id,
    source: edge.source,
    target: edge.target,
    type: edge.type ?? "",
    sourceHandle: edge.sourceHandle ?? "",
    targetHandle: edge.targetHandle ?? "",
    data: edge.data ?? {},
  }
}
