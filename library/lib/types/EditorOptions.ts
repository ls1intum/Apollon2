import { type Edge, type Node } from "@xyflow/react"
import { DiagramType } from "./DiagramType"

export type UMLModel = {
  id: string
  name: string
  type: DiagramType
  nodes: Node[]
  edges: Edge[]
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
  model?: UMLModel
}
