import { SVGAttributes } from "react"
import type { Node } from "@xyflow/react"

import { Class, Package } from "../diagramTypes/classDiagram"

// here we register all the shapes that are available
// you can add your own here
export const DiagramElementComponents = {
  class: Class,
  package: Package,
}

export type DiagramElementType = keyof typeof DiagramElementComponents

export type DiagramElementProps = {
  width: number
  height: number
} & SVGAttributes<SVGElement>

export type DiagramElementComponentProps = Partial<DiagramElementProps> & {
  type: DiagramElementType
}

export type DiagramElementNode = Node<{
  type: DiagramElementType
  color?: string
}>
