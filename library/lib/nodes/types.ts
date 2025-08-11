import { NodeTypes } from "@xyflow/react" // Explicitly differentiate imported type
import { Class, ColorDescription } from "./classDiagram"
import { TitleAndDesctiption } from "./TitleAndDescriptionNode"
import Package from "./classDiagram/Package"
import {
  Activity,
  ActivityInitialNode,
  ActivityFinalNode,
  ActivityActionNode,
  ActivityObjectNode,
  ActivityMergeNode,
  ActivityForkNode,
  ActivityForkNodeHorizontal,
} from "./activityDiagram"
import { UseCase, UseCaseActor, UseCaseSystem } from "./useCaseDiagram"
import {
  Component,
  ComponentInterface,
  ComponentSubsystem,
} from "./componentDiagram"
import {
  FlowchartTerminal,
  FlowchartProcess,
  FlowchartDecision,
  FlowchartInputOutput,
  FlowchartFunctionCall,
} from "./flowchart"

export const diagramNodeTypes = {
  package: Package,
  class: Class,
  colorDescription: ColorDescription,
  titleAndDesctiption: TitleAndDesctiption,
  activity: Activity,
  activityInitialNode: ActivityInitialNode,
  activityFinalNode: ActivityFinalNode,
  activityActionNode: ActivityActionNode,
  activityObjectNode: ActivityObjectNode,
  activityMergeNode: ActivityMergeNode,
  activityForkNode: ActivityForkNode,
  activityForkNodeHorizontal: ActivityForkNodeHorizontal,
  useCase: UseCase,
  useCaseActor: UseCaseActor,
  useCaseSystem: UseCaseSystem,
  component: Component,
  componentInterface: ComponentInterface,
  componentSubsystem: ComponentSubsystem,
  flowchartTerminal: FlowchartTerminal,
  flowchartProcess: FlowchartProcess,
  flowchartDecision: FlowchartDecision,
  flowchartInputOutput: FlowchartInputOutput,
  flowchartFunctionCall: FlowchartFunctionCall,
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
  activityFinalNode: "activityFinalNode",
  activityActionNode: "activityActionNode",
  activityObjectNode: "activityObjectNode",
  activityMergeNode: "activityMergeNode",
  activityForkNode: "activityForkNode",
  activityForkNodeHorizontal: "activityForkNodeHorizontal",
  useCase: "useCase",
  useCaseActor: "useCaseActor",
  useCaseSystem: "useCaseSystem",
  component: "component",
  componentInterface: "componentInterface",
  componentSubsystem: "componentSubsystem",
  flowchartTerminal: "flowchartTerminal",
  flowchartProcess: "flowchartProcess",
  flowchartDecision: "flowchartDecision",
  flowchartInputOutput: "flowchartInputOutput",
  flowchartFunctionCall: "flowchartFunctionCall",
} as const
