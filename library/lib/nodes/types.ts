import { NodeTypes } from "@xyflow/react" // Explicitly differentiate imported type
import { Class, ColorDescription } from "./classDiagram"
import { TitleAndDesctiption } from "./TitleAndDescriptionNode"
import Package from "./classDiagram/Package"

export const diagramNodeTypes = {
  package: Package,
  class: Class,
  colorDescription: ColorDescription,
  titleAndDesctiption: TitleAndDesctiption,
} satisfies NodeTypes

export type DiagramNodeTypeKeys = keyof typeof diagramNodeTypes
