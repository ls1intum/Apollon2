import { NodeTypes } from "@xyflow/react" // Explicitly differentiate imported type
import { Class, ColorDescription } from "./classDiagram"
import { TitleAndDesctiption } from "./TitleAndDescriptionNode"
import Package from "./classDiagram/Package"
import { Activity, ActivityInitialNode } from "./activityDiagram"

export const diagramNodeTypes = {
  package: Package,
  class: Class,
  colorDescription: ColorDescription,
  titleAndDesctiption: TitleAndDesctiption,
  activity: Activity,
  activityInitialNode: ActivityInitialNode,
} satisfies NodeTypes

// 2. Union type from keys
export type DiagramNodeType = keyof typeof diagramNodeTypes

// 3. Enum-like object (manually declared once, same keys)
export const DiagramNodeTypeRecord: Record<DiagramNodeType, DiagramNodeType> = {
  package: "package",
  class: "class",
  colorDescription: "colorDescription",
  titleAndDesctiption: "titleAndDesctiption",
  activity: "activity",
  activityInitialNode: "activityInitialNode",
} as const
