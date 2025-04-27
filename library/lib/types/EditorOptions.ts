import { DiagramType } from "./DiagramType"

export type ApollonNode = {
  id: string
  width: number
  height: number
  type: string
  position: {
    x: number
    y: number
  }
  data: {
    [key: string]: unknown
  }
  measured: { width: number; height: number }
}

export type ApollonEdge = {
  id: string
  source: string
  target: string
  type: string
  sourceHandle: string
  targetHandle: string
  data: {
    [key: string]: unknown
  }
}
export type ApollonDiagram = {
  id: string
  version: string
  title: string
  type: DiagramType
  nodes: ApollonNode[]
  edges: ApollonEdge[]
}

export const enum ApollonView {
  Modelling = "Modelling",
  Exporting = "Exporting",
  Highlight = "Highlight",
}

export const enum ApollonMode {
  Modelling = "Modelling",
  Exporting = "Exporting",
  Assessment = "Assessment",
}

export type ApollonOptions = {
  mode?: ApollonMode
  readonly?: boolean
  enablePopups?: boolean
  model?: ApollonDiagram
}
