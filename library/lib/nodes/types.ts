import { NodeTypes } from "@xyflow/react" // Explicitly differentiate imported type
import { Class, ColorDescription, Package } from "./classDiagram"
import { TitleAndDesctiption } from "./TitleAndDescriptionNode"

export const diagramNodeTypes = {
  package: Package,
  class: Class,
  colorDescription: ColorDescription,
  titleAndDesctiption: TitleAndDesctiption,
} satisfies NodeTypes

export type DiagramNodeTypeKeys = keyof typeof diagramNodeTypes
