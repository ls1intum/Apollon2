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

export interface ExtraElement {
  id: string
  name: string
}

export interface MinSize {
  minWidth: number
  minHeight: number
}

export interface SVGComponentProps {
  width: number
  height: number
  transformScale?: number
  svgAttributes?: React.SVGAttributes<SVGElement>
  setMinSize?: React.Dispatch<React.SetStateAction<MinSize>>
  id: string
}
