import { DiagramType } from "@/types"

const diagramTypeValues = new Set(Object.values(DiagramType))

function isDiagramType(value: unknown): value is DiagramType {
  return diagramTypeValues.has(value as DiagramType)
}

export function parseDiagramType(
  value: unknown,
  fallback: DiagramType = DiagramType.ClassDiagram
): DiagramType {
  return isDiagramType(value) ? value : fallback
}
