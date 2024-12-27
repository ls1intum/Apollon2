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
