import { nodeTypes } from "@/nodes"

export interface DropNodeData {
  type: keyof typeof nodeTypes
  data?: Record<string, unknown>
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
