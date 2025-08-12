import {
  useDiagramStore,
  usePopoverStore,
  useMetadataStore,
} from "@/store/context"
import { ApollonMode, DiagramEdgeType } from "@/typings"
import { useShallow } from "zustand/shallow"
import {
  ClassEditPopover,
  ClassGiveFeedbackPopover,
  ClassSeeFeedbackPopover,
  DefaultNodeEditPopover,
  DefaultNodeGiveFeedbackPopover,
  DefaultNodeSeeFeedbackPopover,
} from "./classDiagram"
import { useViewportCenter } from "@/hooks"
import { getPopoverOrigin, getPositionOnCanvas, getQuadrant } from "@/utils"
import { PopoverProps } from "./types"
import { GenericPopover } from "./GenericPopover"
import {
  ActivityDiagramEdgeEditPopover,
  EdgeEditPopover,
  UseCaseEdgeEditPopover,
  EdgeGiveFeedbackPopover,
  EdgeSeeFeedbackPopover,
} from "./edgePopovers"
import { LocationPopover } from "@/types"
import {
  ComponentEditPopover,
  ComponentSubsystemEditPopover,
} from "./componentDiagram"
import {
  DeploymentComponentEditPopover,
  DeploymentNodeEditPopover,
} from "./deploymentDiagram"
import {
  SyntaxTreeNonterminalEditPopover,
  SyntaxTreeTerminalEditPopover,
} from "./syntaxTreeDiagram"

type PopoverType =
  | "class"
  | "default"
  | DiagramEdgeType
  | "Component"
  | "ComponentSubsystem"
  | "FlowchartTerminal"
  | "FlowchartProcess"
  | "FlowchartDecision"
  | "FlowchartInputOutput"
  | "FlowchartFunctionCall"
  | "DeploymentComponent"
  | "DeploymentNode"
  | "SyntaxTreeNonterminal"
  | "SyntaxTreeTerminal"

const editPopovers: {
  class: React.FC<PopoverProps>
  default: React.FC<PopoverProps>
  ClassAggregation: React.FC<PopoverProps>
  ClassInheritance: React.FC<PopoverProps>
  ClassRealization: React.FC<PopoverProps>
  ClassComposition: React.FC<PopoverProps>
  ClassBidirectional: React.FC<PopoverProps>
  ClassUnidirectional: React.FC<PopoverProps>
  ClassDependency: React.FC<PopoverProps>
  ActivityControlFlow: React.FC<PopoverProps>
  UseCaseAssociation: React.FC<PopoverProps>
  UseCaseInclude: React.FC<PopoverProps>
  UseCaseExtend: React.FC<PopoverProps>
  UseCaseGeneralization: React.FC<PopoverProps>
  Component: React.FC<PopoverProps>
  ComponentSubsystem: React.FC<PopoverProps>
  FlowchartTerminal: React.FC<PopoverProps>
  FlowchartProcess: React.FC<PopoverProps>
  FlowchartDecision: React.FC<PopoverProps>
  FlowchartInputOutput: React.FC<PopoverProps>
  FlowchartFunctionCall: React.FC<PopoverProps>
  DeploymentComponent: React.FC<PopoverProps>
  DeploymentNode: React.FC<PopoverProps>
  SyntaxTreeNonterminal: React.FC<PopoverProps>
  SyntaxTreeTerminal: React.FC<PopoverProps>
} = {
  class: ClassEditPopover,
  default: DefaultNodeEditPopover,
  ClassAggregation: EdgeEditPopover,
  ClassInheritance: EdgeEditPopover,
  ClassRealization: EdgeEditPopover,
  ClassComposition: EdgeEditPopover,
  ClassBidirectional: EdgeEditPopover,
  ClassUnidirectional: EdgeEditPopover,
  ClassDependency: EdgeEditPopover,
  ActivityControlFlow: ActivityDiagramEdgeEditPopover,
  UseCaseAssociation: UseCaseEdgeEditPopover,
  UseCaseInclude: UseCaseEdgeEditPopover,
  UseCaseExtend: UseCaseEdgeEditPopover,
  UseCaseGeneralization: UseCaseEdgeEditPopover,
  Component: ComponentEditPopover,
  ComponentSubsystem: ComponentSubsystemEditPopover,
  FlowchartTerminal: DefaultNodeEditPopover,
  FlowchartProcess: DefaultNodeEditPopover,
  FlowchartDecision: DefaultNodeEditPopover,
  FlowchartInputOutput: DefaultNodeEditPopover,
  FlowchartFunctionCall: DefaultNodeEditPopover,
  DeploymentComponent: DeploymentComponentEditPopover,
  DeploymentNode: DeploymentNodeEditPopover,
  SyntaxTreeNonterminal: SyntaxTreeNonterminalEditPopover,
  SyntaxTreeTerminal: SyntaxTreeTerminalEditPopover,
}

const giveFeedbackPopovers: {
  class: React.FC<PopoverProps>
  default: React.FC<PopoverProps>
  ClassAggregation: React.FC<PopoverProps>
  ClassInheritance: React.FC<PopoverProps>
  ClassRealization: React.FC<PopoverProps>
  ClassComposition: React.FC<PopoverProps>
  ClassBidirectional: React.FC<PopoverProps>
  ClassUnidirectional: React.FC<PopoverProps>
  ClassDependency: React.FC<PopoverProps>
  ActivityControlFlow: React.FC<PopoverProps>
  UseCaseAssociation: React.FC<PopoverProps>
  UseCaseInclude: React.FC<PopoverProps>
  UseCaseExtend: React.FC<PopoverProps>
  UseCaseGeneralization: React.FC<PopoverProps>
  Component: React.FC<PopoverProps>
  ComponentSubsystem: React.FC<PopoverProps>
  FlowchartTerminal: React.FC<PopoverProps>
  FlowchartProcess: React.FC<PopoverProps>
  FlowchartDecision: React.FC<PopoverProps>
  FlowchartInputOutput: React.FC<PopoverProps>
  FlowchartFunctionCall: React.FC<PopoverProps>
  DeploymentComponent: React.FC<PopoverProps>
  DeploymentNode: React.FC<PopoverProps>
  SyntaxTreeNonterminal: React.FC<PopoverProps>
  SyntaxTreeTerminal: React.FC<PopoverProps>
} = {
  class: ClassGiveFeedbackPopover,
  default: DefaultNodeGiveFeedbackPopover,
  ClassAggregation: EdgeGiveFeedbackPopover,
  ClassInheritance: EdgeGiveFeedbackPopover,
  ClassRealization: EdgeGiveFeedbackPopover,
  ClassComposition: EdgeGiveFeedbackPopover,
  ClassBidirectional: EdgeGiveFeedbackPopover,
  ClassUnidirectional: EdgeGiveFeedbackPopover,
  ClassDependency: EdgeGiveFeedbackPopover,
  ActivityControlFlow: EdgeGiveFeedbackPopover,
  UseCaseAssociation: EdgeGiveFeedbackPopover,
  UseCaseInclude: EdgeGiveFeedbackPopover,
  UseCaseExtend: EdgeGiveFeedbackPopover,
  UseCaseGeneralization: EdgeGiveFeedbackPopover,
  Component: DefaultNodeGiveFeedbackPopover,
  ComponentSubsystem: DefaultNodeGiveFeedbackPopover,
  FlowchartTerminal: DefaultNodeGiveFeedbackPopover,
  FlowchartProcess: DefaultNodeGiveFeedbackPopover,
  FlowchartDecision: DefaultNodeGiveFeedbackPopover,
  FlowchartInputOutput: DefaultNodeGiveFeedbackPopover,
  FlowchartFunctionCall: DefaultNodeGiveFeedbackPopover,
  DeploymentComponent: DefaultNodeGiveFeedbackPopover,
  DeploymentNode: DefaultNodeGiveFeedbackPopover,
  SyntaxTreeNonterminal: DefaultNodeGiveFeedbackPopover,
  SyntaxTreeTerminal: DefaultNodeGiveFeedbackPopover,
}

const seeFeedbackPopovers: {
  class: React.FC<PopoverProps>
  default: React.FC<PopoverProps>
  ClassAggregation: React.FC<PopoverProps>
  ClassInheritance: React.FC<PopoverProps>
  ClassRealization: React.FC<PopoverProps>
  ClassComposition: React.FC<PopoverProps>
  ClassBidirectional: React.FC<PopoverProps>
  ClassUnidirectional: React.FC<PopoverProps>
  ClassDependency: React.FC<PopoverProps>
  ActivityControlFlow: React.FC<PopoverProps>
  UseCaseAssociation: React.FC<PopoverProps>
  UseCaseInclude: React.FC<PopoverProps>
  UseCaseExtend: React.FC<PopoverProps>
  UseCaseGeneralization: React.FC<PopoverProps>
  Component: React.FC<PopoverProps>
  ComponentSubsystem: React.FC<PopoverProps>
  FlowchartTerminal: React.FC<PopoverProps>
  FlowchartProcess: React.FC<PopoverProps>
  FlowchartDecision: React.FC<PopoverProps>
  FlowchartInputOutput: React.FC<PopoverProps>
  FlowchartFunctionCall: React.FC<PopoverProps>
  DeploymentComponent: React.FC<PopoverProps>
  DeploymentNode: React.FC<PopoverProps>
  SyntaxTreeNonterminal: React.FC<PopoverProps>
  SyntaxTreeTerminal: React.FC<PopoverProps>
} = {
  class: ClassSeeFeedbackPopover,
  default: DefaultNodeSeeFeedbackPopover,
  ClassAggregation: EdgeSeeFeedbackPopover,
  ClassInheritance: EdgeSeeFeedbackPopover,
  ClassRealization: EdgeSeeFeedbackPopover,
  ClassComposition: EdgeSeeFeedbackPopover,
  ClassBidirectional: EdgeSeeFeedbackPopover,
  ClassUnidirectional: EdgeSeeFeedbackPopover,
  ClassDependency: EdgeSeeFeedbackPopover,
  ActivityControlFlow: EdgeSeeFeedbackPopover,
  UseCaseAssociation: EdgeSeeFeedbackPopover,
  UseCaseInclude: EdgeSeeFeedbackPopover,
  UseCaseExtend: EdgeSeeFeedbackPopover,
  UseCaseGeneralization: EdgeSeeFeedbackPopover,
  Component: DefaultNodeSeeFeedbackPopover,
  ComponentSubsystem: DefaultNodeSeeFeedbackPopover,
  FlowchartTerminal: DefaultNodeSeeFeedbackPopover,
  FlowchartProcess: DefaultNodeSeeFeedbackPopover,
  FlowchartDecision: DefaultNodeSeeFeedbackPopover,
  FlowchartInputOutput: DefaultNodeSeeFeedbackPopover,
  FlowchartFunctionCall: DefaultNodeSeeFeedbackPopover,
  DeploymentComponent: DefaultNodeSeeFeedbackPopover,
  DeploymentNode: DefaultNodeSeeFeedbackPopover,
  SyntaxTreeNonterminal: DefaultNodeSeeFeedbackPopover,
  SyntaxTreeTerminal: DefaultNodeSeeFeedbackPopover,
}

interface PopoverManagerProps {
  elementId: string
  anchorEl: HTMLElement | SVGSVGElement | null
  type: PopoverType
}

export const PopoverManager = ({
  elementId,
  anchorEl,
  type,
}: PopoverManagerProps) => {
  const viewportCenter = useViewportCenter()
  const { nodes } = useDiagramStore(
    useShallow((state) => ({
      nodes: state.nodes,
    }))
  )

  const { diagramMode, readonly } = useMetadataStore(
    useShallow((state) => ({
      diagramMode: state.mode,
      readonly: state.readonly,
    }))
  )
  const { popoverElementId, popupEnabled, setPopOverElementId } =
    usePopoverStore(
      useShallow((state) => ({
        popoverElementId: state.popoverElementId,
        popupEnabled: state.popupEnabled,
        setPopOverElementId: state.setPopOverElementId,
      }))
    )

  if (!anchorEl || !popupEnabled) {
    return null
  }

  const open = popoverElementId === elementId
  const onClose = () => {
    setPopOverElementId(null)
  }

  let popoverOrigin: LocationPopover = {
    anchorOrigin: { vertical: "top", horizontal: "right" },
    transformOrigin: { vertical: "top", horizontal: "left" },
  }

  const node = nodes.find((node) => node.id === elementId)
  if (node && anchorEl && open) {
    const nodePositionOnCanvas = getPositionOnCanvas(node, nodes)
    const quadrant = getQuadrant(nodePositionOnCanvas, viewportCenter)
    popoverOrigin = getPopoverOrigin(quadrant)
  }

  let Component: React.ComponentType<PopoverProps> | null = null

  const isEditing = diagramMode === ApollonMode.Modelling && !readonly
  const isGivingFeedback = diagramMode === ApollonMode.Assessment && !readonly
  const isSeeingFeedback = diagramMode === ApollonMode.Assessment && readonly

  if (isEditing) {
    Component = editPopovers[type] ?? null
  } else if (isGivingFeedback) {
    Component = giveFeedbackPopovers[type] ?? null
  } else if (isSeeingFeedback) {
    Component = seeFeedbackPopovers[type] ?? null
  }

  return Component ? (
    <GenericPopover
      id={`popover-${elementId}`}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={popoverOrigin.anchorOrigin}
      transformOrigin={popoverOrigin.transformOrigin}
      maxHeight={700}
      maxWidth={isEditing ? 500 : 400}
    >
      <Component elementId={elementId} />
    </GenericPopover>
  ) : null
}
