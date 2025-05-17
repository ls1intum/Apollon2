import { Assessment } from "./Assessments"
import { UMLDiagramType } from "./DiagramType"

export enum Locale {
  en = "en",
  de = "de",
}

export enum ApollonMode {
  Modelling = "Modelling",
  Exporting = "Exporting",
  Assessment = "Assessment",
}

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
  parentId?: string
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

export type Selection = {
  nodes: { [id: string]: boolean }
  edges: { [id: string]: boolean }
}

// export type UMLModel = {
//   version: `3.${number}.${number}`;
//   type: UMLDiagramType;
//   size: { width: number; height: number };
//   elements: { [id: string]: UMLElement };
//   interactive: Selection;
//   relationships: { [id: string]: UMLRelationship };
//   assessments: { [id: string]: Assessment };
// };

export type UMLModel = {
  version: `4.${number}.${number}`
  id: string
  title: string
  type: UMLDiagramType
  nodes: ApollonNode[]
  edges: ApollonEdge[]
  assessments: { [id: string]: Assessment }
  // assessments: Record<string, Assessment>
}

export enum ApollonView {
  Modelling = "Modelling",
  Exporting = "Exporting",
  Highlight = "Highlight",
}

export type ApollonOptions = {
  type?: UMLDiagramType
  mode?: ApollonMode
  readonly?: boolean
  enablePopups?: boolean
  model?: UMLModel
  theme?: Partial<Record<string, string>>
  locale?: Locale
  copyPasteToClipboard?: boolean
  colorEnabled?: boolean
  scale?: number
}
