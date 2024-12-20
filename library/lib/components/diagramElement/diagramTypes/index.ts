import { SVGAttributes } from "react"
import type { Node } from "@xyflow/react"

import {
  Class,
  Package,
} from "@/components/diagramElement/diagramTypes/classDiagram"

// here we register all the shapes that are available
// you can add your own here
export const DiagramElementComponents = {
  class: Class,
  package: Package,
}

export type DiagramElementType = keyof typeof DiagramElementComponents

export type ShapeProps = {
  width: number
  height: number
} & SVGAttributes<SVGElement>

export type ShapeComponentProps = Partial<ShapeProps> & {
  type: DiagramElementType
}

export type ShapeNode = Node<{
  type: DiagramElementType
  color: string
}>
