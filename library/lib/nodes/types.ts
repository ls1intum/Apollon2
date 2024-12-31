import { NodeTypes } from "@xyflow/react" // Explicitly differentiate imported type
import { Class, ColorDescription, Package } from "./classDiagram"

export const diagramNodeTypes = {
  package: Package,
  class: Class,
  colorDescription: ColorDescription,
} satisfies NodeTypes

export type DiagramNodeTypeKeys = keyof typeof diagramNodeTypes
