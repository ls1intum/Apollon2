import { DiagramNodeTypeKeys } from "@/nodes"

export interface DropNodeData {
  type: DiagramNodeTypeKeys
  data: Record<string, unknown>
  offsetX: number
  offsetY: number
}
