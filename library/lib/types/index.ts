import { DiagramNodeTypeKeys } from "@/nodes"

export interface DropNodeData {
  type: DiagramNodeTypeKeys
  data: Record<string, unknown>
  offsetX: number
  offsetY: number
}

export enum ClassType {
  Abstract = "Abstract",
  Interface = "Interface",
  Enumeration = "Enumeration",
}

export type ExtraElements = {
  id: string
  name: string
}
