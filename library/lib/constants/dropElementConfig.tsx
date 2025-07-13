/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClassSVG, PackageSVG } from "@/components"
import { generateUUID } from "@/utils"
import { ClassType, UMLDiagramType } from "@/types"
import { DiagramNodeType } from "@/nodes"
import { ActivitySVG } from "@/components/svgs/nodes/activityDiagram/ActivitySVG"

export * from "./layoutConstants"
export const transformScale = 0.7

const droppedElementWidth = 160

export type DropElementConfig = {
  type: DiagramNodeType
  width: number
  height: number
  defaultData: Record<string, unknown>
  svg: React.FC<any>
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
    // {
    //   type: "ActivityInitialNode",
    //   width: droppedElementWidth,
    //   height: 70,
    //   defaultData: {
    //     name: "ActivityInitialNode",
    //   },
    //   svg: (props) => <ClassSVG {...props} />,
    // },
    // {
    //   type: "ActivityFinalNode",
    //   width: droppedElementWidth,
    //   height: 70,
    //   defaultData: {
    //     name: "ActivityFinalNode",
    //   },
    //   svg: (props) => <ClassSVG {...props} />,
    // },
    // {
    //   type: "ActivityActionNode",
    //   width: droppedElementWidth,
    //   height: 70,
    //   defaultData: {
    //     name: "ActivityActionNode",
    //   },
    //   svg: (props) => <ClassSVG {...props} />,
    // },
    // {
    //   type: "ActivityObjectNode",
    //   width: droppedElementWidth,
    //   height: 70,
    //   defaultData: {
    //     name: "ActivityObjectNode",
    //   },
    //   svg: (props) => <ClassSVG {...props} />,
    // },
    // {
    //   type: "ActivityMergeNode",
    //   width: droppedElementWidth,
    //   height: 70,
    //   defaultData: {
    //     name: "ActivityMergeNode",
    //   },
    //   svg: (props) => <ClassSVG {...props} />,
    // },
    // {
    //   type: "ActivityForkNode",
    //   width: droppedElementWidth,
    //   height: 70,
    //   defaultData: {
    //     name: "ActivityForkNode",
    //   },
    //   svg: (props) => <ClassSVG {...props} />,
    // },
    // {
    //   type: "ActivityForkNodeHorizontal",
    //   width: droppedElementWidth,
    //   height: 70,
    //   defaultData: {
    //     name: "ActivityForkNodeHorizontal",
    //   },
    //   svg: (props) => <ClassSVG {...props} />,
    // },
  ],
  [UMLDiagramType.BPMN]: [],
  [UMLDiagramType.CommunicationDiagram]: [],
  [UMLDiagramType.ComponentDiagram]: [],
  [UMLDiagramType.DeploymentDiagram]: [],
  [UMLDiagramType.PetriNet]: [],
  [UMLDiagramType.ReachabilityGraph]: [],
  [UMLDiagramType.SyntaxTree]: [],
  [UMLDiagramType.UseCaseDiagram]: [],
  [UMLDiagramType.Flowchart]: [],
}
