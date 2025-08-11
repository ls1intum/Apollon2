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
} from "@/components"
import { generateUUID } from "@/utils"
import { ClassType, UMLDiagramType } from "@/types"
import { DiagramNodeType } from "@/nodes"

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
      type: "class",
      width: droppedElementWidth,
      height: 70,
      defaultData: {
        name: "Object",
        stereotype: ClassType.ObjectClass,
        attributes: [{ id: generateUUID(), name: "attribute = value" }],
        methods: [],
      },
      svg: (props) => <ClassSVG {...props} />,
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
      svg: (props) => <ActivityForkNodeHorizontalSVG {...props} />,
    },
  ],
  [UMLDiagramType.BPMN]: [],
  [UMLDiagramType.CommunicationDiagram]: [],
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
  [UMLDiagramType.DeploymentDiagram]: [],
  [UMLDiagramType.PetriNet]: [],
  [UMLDiagramType.ReachabilityGraph]: [],
  [UMLDiagramType.SyntaxTree]: [],
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
      type: "FlowchartTerminal",
      width: droppedElementWidth,
      height: 70,
      defaultData: {
        name: "Terminal",
      },
      svg: (props) => <FlowchartTerminalNodeSVG {...props} />,
    },
    {
      type: "FlowchartProcess",
      width: droppedElementWidth,
      height: 70,
      defaultData: {
        name: "Process",
      },
      svg: (props) => <FlowchartProcessNodeSVG {...props} />,
    },
    {
      type: "FlowchartDecision",
      width: droppedElementWidth,
      height: 70,
      defaultData: {
        name: "Decision",
      },
      svg: (props) => <FlowchartDecisionNodeSVG {...props} />,
    },
    {
      type: "FlowchartInputOutput",
      width: 140,
      height: 70,
      defaultData: {
        name: "Input/Output",
      },
      svg: (props) => <FlowchartInputOutputNodeSVG {...props} />,
    },
    {
      type: "FlowchartFunctionCall",
      width: droppedElementWidth,
      height: 70,
      defaultData: {
        name: "Function Call",
      },
      svg: (props) => <FlowchartFunctionCallNodeSVG {...props} />,
    },
  ],
}
