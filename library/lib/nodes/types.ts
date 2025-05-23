import { NodeTypes } from "@xyflow/react" // Explicitly differentiate imported type
import { Class, ColorDescription } from "./classDiagram"
import { TitleAndDesctiption } from "./TitleAndDescriptionNode"
import Package from "./classDiagram/Package"

export const diagramNodeTypes = {
  Package: Package,
  Class: Class,
  ColorDescription: ColorDescription,
  TitleAndDesctiption: TitleAndDesctiption,
} satisfies NodeTypes

export type DiagramNodeType = keyof typeof diagramNodeTypes
