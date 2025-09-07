/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ActivityActionNodeSVG,
  ActivityFinalNodeSVG,
  ActivityForkNodeHorizontalSVG,
  ActivityForkNodeSVG,
  ActivityInitialNodeSVG,
  ActivityMergeNodeSVG,
  ActivityObjectNodeSVG,
  ActivitySVG,
  ClassSVG,
  PackageSVG,
  UseCaseNodeSVG,
  UseCaseSystemNodeSVG,
  UseCaseActorNodeSVG,
  ComponentNodeSVG,
  ComponentInterfaceNodeSVG,
  ComponentSubsystemNodeSVG,
  FlowchartTerminalNodeSVG,
  FlowchartProcessNodeSVG,
  FlowchartDecisionNodeSVG,
  FlowchartInputOutputNodeSVG,
  FlowchartFunctionCallNodeSVG,
  DeploymentNodeSVG,
  DeploymentComponentSVG,
  DeploymentArtifactSVG,
  DeploymentInterfaceSVG,
  SyntaxTreeNonterminalNodeSVG,
  SyntaxTreeTerminalNodeSVG,
  ObjectNameSVG,
  CommunicationObjectNameSVG,
  PetriNetPlaceSVG,
  PetriNetTransitionSVG,
  BPMNTaskNodeSVG,
  BPMNEventNodeSVG,
  BPMNGatewayNodeSVG,
  BPMNSubprocessNodeSVG,
  BPMNAnnotationNodeSVG,
  BPMNDataObjectNodeSVG,
  BPMNDataStoreNodeSVG,
  BPMNPoolNodeSVG,
  BPMNGroupNodeSVG,
  ColorDescriptionSVG,
} from "@/components"
import { generateUUID } from "@/utils"
import { ClassType, UMLDiagramType } from "@/types"
import { DiagramNodeType } from "@/nodes"
import { ReachabilityGraphMarkingSVG } from "@/components/svgs/nodes/reachabilityGraphDiagram/ReachabilityGraphMarkingSVG"
import {
  SfcStartNodeSVG,
  SfcStepNodeSVG,
  SfcJumpNodeSVG,
  SfcTransitionBranchNodeSVG,
  SfcActionTableNodeSVG,
} from "@/components"

export * from "./layoutConstants"
export const transformScale = 0.8

const droppedElementWidth = 160

export type DropElementConfig = {
  type: DiagramNodeType
  width: number
  height: number
  defaultData?: Record<string, unknown>
  svg: React.FC<any>
  marginTop?: number
}

export const dropElementConfigs: Record<UMLDiagramType, DropElementConfig[]> = {
  [UMLDiagramType.ClassDiagram]: [
    {
      type: "package",
      width: droppedElementWidth,
      height: 120,
      defaultData: { name: "Package" },
      svg: (props) => <PackageSVG {...props} />,
    },
    {
      type: "class",
      width: droppedElementWidth,
      height: 100,
      defaultData: {
        name: "Class",
        methods: [{ id: generateUUID(), name: "+ method()" }],
        attributes: [{ id: generateUUID(), name: "+ attribute: Type" }],
      },
      svg: (props) => <ClassSVG {...props} />,
    },
    {
      type: "class",
      width: droppedElementWidth,
      height: 110,
      defaultData: {
        name: "Abstract",
        stereotype: ClassType.Abstract,
        methods: [{ id: generateUUID(), name: "+ method()" }],
        attributes: [{ id: generateUUID(), name: "+ attribute: Type" }],
      },
      svg: (props) => <ClassSVG {...props} />,
    },
    {
      type: "class",
      width: droppedElementWidth,
      height: 140,
      defaultData: {
        name: "Enumeration",
        stereotype: ClassType.Enumeration,
        methods: [],
        attributes: [
          { id: generateUUID(), name: "Case 1" },
          { id: generateUUID(), name: "Case 2" },
          { id: generateUUID(), name: "Case 3" },
        ],
      },
      svg: (props) => <ClassSVG {...props} />,
    },
    {
      type: "class",
      width: droppedElementWidth,
      height: 110,
      defaultData: {
        name: "Interface",
        stereotype: ClassType.Interface,
        methods: [{ id: generateUUID(), name: "+ method()" }],
        attributes: [{ id: generateUUID(), name: "+ attribute: Type" }],
      },
      svg: (props) => <ClassSVG {...props} />,
    },
  ],
  [UMLDiagramType.ObjectDiagram]: [
    {
      type: "objectName",
      width: droppedElementWidth,
      height: 70,
      defaultData: {
        name: "Object",
        attributes: [{ id: generateUUID(), name: "attribute = value" }],
        methods: [],
      },
      svg: (props) => <ObjectNameSVG {...props} />,
    },
  ],
  [UMLDiagramType.ActivityDiagram]: [
    {
      type: "activity",
      width: droppedElementWidth,
      height: 120,
      defaultData: {
        name: "Activity",
      },
      svg: (props) => <ActivitySVG {...props} />,
    },
    {
      type: "activityInitialNode",
      width: 50,
      height: 50,
      defaultData: {
        name: "ActivityInitialNode",
      },
      svg: (props) => <ActivityInitialNodeSVG {...props} />,
    },
    {
      type: "activityFinalNode",
      width: 50,
      height: 50,
      defaultData: {
        name: "ActivityFinalNode",
      },
      svg: (props) => <ActivityFinalNodeSVG {...props} />,
    },
    {
      type: "activityActionNode",
      width: droppedElementWidth,
      height: 120,
      defaultData: {
        name: "Action",
      },
      svg: (props) => <ActivityActionNodeSVG {...props} />,
    },
    {
      type: "activityObjectNode",
      width: droppedElementWidth,
      height: 120,
      defaultData: {
        name: "Object",
      },
      svg: (props) => <ActivityObjectNodeSVG {...props} />,
    },
    {
      type: "activityMergeNode",
      width: droppedElementWidth,
      height: 120,
      defaultData: {
        name: "Condition",
      },
      svg: (props) => <ActivityMergeNodeSVG {...props} />,
    },
    {
      type: "activityForkNode",
      width: 20,
      height: 100,
      defaultData: {
        name: "ActivityForkNode",
      },
      svg: (props) => <ActivityForkNodeSVG {...props} />,
    },
    {
      type: "activityForkNodeHorizontal",
      width: 100,
      height: 20,
      defaultData: {
        name: "ActivityForkNodeHorizontal",
      },
      svg: (props) => <ActivityForkNodeHorizontalSVG {...props} />,
    },
  ],
  [UMLDiagramType.BPMN]: [
    {
      type: "bpmnTask",
      width: droppedElementWidth,
      height: 60,
      defaultData: { name: "Task", taskType: "default", marker: "none" },
      svg: (props) => <BPMNTaskNodeSVG {...props} />,
    },
    {
      type: "bpmnSubprocess",
      width: droppedElementWidth,
      height: 60,
      defaultData: { name: "Subprocess" },
      svg: (props) => <BPMNSubprocessNodeSVG {...props} />,
    },
    {
      type: "bpmnTransaction",
      width: droppedElementWidth,
      height: 60,
      defaultData: { name: "Transaction" },
      svg: (props) => (
        <BPMNSubprocessNodeSVG variant="transaction" {...props} />
      ),
    },
    {
      type: "bpmnCallActivity",
      width: droppedElementWidth,
      height: 60,
      defaultData: { name: "Call Activity" },
      svg: (props) => <BPMNSubprocessNodeSVG variant="call" {...props} />,
    },
    {
      type: "bpmnGroup",
      width: droppedElementWidth,
      height: 60,
      defaultData: { name: "Group" },
      svg: (props) => <BPMNGroupNodeSVG {...props} />,
    },
    {
      type: "bpmnAnnotation",
      width: droppedElementWidth,
      height: 60,
      defaultData: { name: "Annotation" },
      svg: (props) => <BPMNAnnotationNodeSVG {...props} />,
    },
    {
      type: "bpmnStartEvent",
      width: 40,
      height: 40,
      defaultData: { name: "", eventType: "default" },
      svg: (props) => <BPMNEventNodeSVG variant="start" {...props} />,
    },
    {
      type: "bpmnIntermediateEvent",
      width: 40,
      height: 40,
      defaultData: { name: "", eventType: "default" },
      svg: (props) => <BPMNEventNodeSVG variant="intermediate" {...props} />,
    },
    {
      type: "bpmnEndEvent",
      width: 40,
      height: 40,
      defaultData: { name: "", eventType: "default" },
      svg: (props) => <BPMNEventNodeSVG variant="end" {...props} />,
    },
    {
      type: "bpmnGateway",
      width: 40,
      height: 40,
      defaultData: { name: "", gatewayType: "exclusive" },
      svg: (props) => <BPMNGatewayNodeSVG {...props} />,
    },
    {
      type: "bpmnDataObject",
      width: 40,
      height: 60,
      defaultData: { name: "" },
      svg: (props) => <BPMNDataObjectNodeSVG {...props} />,
    },
    {
      type: "bpmnDataStore",
      width: 60,
      height: 60,
      defaultData: { name: "" },
      svg: (props) => <BPMNDataStoreNodeSVG {...props} />,
    },
    {
      type: "bpmnPool",
      width: 160,
      height: 80,
      defaultData: { name: "Pool" },
      svg: (props) => <BPMNPoolNodeSVG {...props} />,
    },
  ],
  [UMLDiagramType.CommunicationDiagram]: [
    {
      type: "communicationObjectName",
      width: droppedElementWidth,
      height: 70,
      defaultData: {
        name: "Object",
        attributes: [{ id: generateUUID(), name: "attribute = value" }],
        methods: [],
      },
      svg: (props) => <CommunicationObjectNameSVG {...props} />,
    },
  ],
  [UMLDiagramType.ComponentDiagram]: [
    {
      type: "component",
      width: 180,
      height: 120,
      defaultData: {
        name: "Component",
        isComponentHeaderShown: true,
      },
      svg: (props) => <ComponentNodeSVG {...props} />,
    },
    {
      type: "componentSubsystem",
      width: 180,
      height: 120,
      defaultData: {
        name: "Subsystem",
        isComponentSubsystemHeaderShown: true,
      },
      svg: (props) => <ComponentSubsystemNodeSVG {...props} />,
    },
    {
      type: "componentInterface",
      width: 20,
      height: 20,
      defaultData: {
        name: "Interface",
      },
      svg: (props) => <ComponentInterfaceNodeSVG {...props} />,
      marginTop: 10,
    },
  ],
  [UMLDiagramType.DeploymentDiagram]: [
    {
      type: "deploymentNode",
      width: droppedElementWidth,
      height: 100,
      defaultData: {
        name: "Node",
        isComponentHeaderShown: true,
        stereotype: "node",
      },
      svg: (props) => <DeploymentNodeSVG {...props} />,
    },
    {
      type: "deploymentComponent",
      width: droppedElementWidth,
      height: 100,
      defaultData: {
        name: "Component",
        isComponentHeaderShown: true,
      },
      svg: (props) => <DeploymentComponentSVG {...props} />,
    },
    {
      type: "deploymentArtifact",
      width: droppedElementWidth,
      height: 50,
      defaultData: {
        name: "Artifact",
      },
      svg: (props) => <DeploymentArtifactSVG {...props} />,
    },
    {
      type: "deploymentInterface",
      width: 20,
      height: 20,
      defaultData: {
        name: "Interface",
      },
      svg: (props) => <DeploymentInterfaceSVG {...props} />,
      marginTop: 10,
    },
  ],
  [UMLDiagramType.PetriNet]: [
    {
      type: "petriNetTransition",
      width: 30,
      height: 60,
      defaultData: {
        name: "Transition",
      },
      svg: (props) => <PetriNetTransitionSVG {...props} />,
      marginTop: 15,
    },
    {
      type: "petriNetPlace",
      width: 60,
      height: 60,
      defaultData: {
        name: "Place",
        tokens: 0,
        capacity: "Infinity",
      },
      svg: (props) => <PetriNetPlaceSVG {...props} />,
      marginTop: 5,
    },
  ],
  [UMLDiagramType.ReachabilityGraph]: [
    {
      type: "reachabilityGraphMarking",
      width: droppedElementWidth,
      height: 120,
      defaultData: {
        name: "Marking",
        isInitialMarking: false,
      },
      svg: (props) => <ReachabilityGraphMarkingSVG {...props} />,
    },
  ],
  [UMLDiagramType.SyntaxTree]: [
    {
      type: "syntaxTreeNonterminal",
      width: droppedElementWidth,
      height: 100,
      defaultData: {
        name: "",
      },
      svg: (props) => <SyntaxTreeNonterminalNodeSVG {...props} />,
    },
    {
      type: "syntaxTreeTerminal",
      width: droppedElementWidth,
      height: 100,
      defaultData: {
        name: "",
      },
      svg: (props) => <SyntaxTreeTerminalNodeSVG {...props} />,
    },
  ],
  [UMLDiagramType.UseCaseDiagram]: [
    {
      type: "useCase",
      width: droppedElementWidth,
      height: 100,
      defaultData: {
        name: "Use Case",
      },
      svg: (props) => <UseCaseNodeSVG {...props} />,
    },
    {
      type: "useCaseActor",
      width: 100,
      height: 150,
      defaultData: {
        name: "Actor",
      },
      svg: (props) => <UseCaseActorNodeSVG {...props} />,
    },
    {
      type: "useCaseSystem",
      width: droppedElementWidth,
      height: 120,
      defaultData: {
        name: "System",
      },
      svg: (props) => <UseCaseSystemNodeSVG {...props} />,
    },
  ],
  [UMLDiagramType.Flowchart]: [
    {
      type: "flowchartTerminal",
      width: droppedElementWidth,
      height: 70,
      defaultData: {
        name: "Terminal",
      },
      svg: (props) => <FlowchartTerminalNodeSVG {...props} />,
    },
    {
      type: "flowchartProcess",
      width: droppedElementWidth,
      height: 70,
      defaultData: {
        name: "Process",
      },
      svg: (props) => <FlowchartProcessNodeSVG {...props} />,
    },
    {
      type: "flowchartDecision",
      width: droppedElementWidth,
      height: 70,
      defaultData: {
        name: "Decision",
      },
      svg: (props) => <FlowchartDecisionNodeSVG {...props} />,
    },
    {
      type: "flowchartInputOutput",
      width: 140,
      height: 70,
      defaultData: {
        name: "Input/Output",
      },
      svg: (props) => <FlowchartInputOutputNodeSVG {...props} />,
    },
    {
      type: "flowchartFunctionCall",
      width: droppedElementWidth,
      height: 70,
      defaultData: {
        name: "Function Call",
      },
      svg: (props) => <FlowchartFunctionCallNodeSVG {...props} />,
    },
  ],
  [UMLDiagramType.Sfc]: [
    {
      type: "sfcStart",
      width: droppedElementWidth,
      height: 70,
      defaultData: { name: "Start" },
      svg: (props) => <SfcStartNodeSVG {...props} />,
    },
    {
      type: "sfcStep",
      width: droppedElementWidth,
      height: 70,
      defaultData: { name: "Step" },
      svg: (props) => <SfcStepNodeSVG {...props} />,
    },
    {
      type: "sfcJump",
      width: 80,
      height: 20,
      defaultData: { name: "Jump" },
      svg: (props) => <SfcJumpNodeSVG {...props} />,
      marginTop: 10,
    },
    {
      type: "sfcTransitionBranch",
      width: 20,
      height: 20,
      defaultData: { name: "" },
      svg: (props) => <SfcTransitionBranchNodeSVG {...props} />,
      marginTop: 10,
    },
    {
      type: "sfcActionTable",
      width: droppedElementWidth,
      height: 30, // Header + one row
      defaultData: {
        name: "",
        actionRows: [
          { id: crypto.randomUUID(), identifier: "A", description: "Actions" },
        ],
      },
      svg: (props) => <SfcActionTableNodeSVG {...props} />,
    },
  ],
}

export const ColorDescriptionConfig: DropElementConfig = {
  type: "colorDescription",
  width: droppedElementWidth,
  height: 50,
  defaultData: {
    name: "Color Description",
  },
  svg: (props) => <ColorDescriptionSVG {...props} />,
}
