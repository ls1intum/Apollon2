/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClassSVG, PackageSVG } from "@/components"
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
  defaultData: Record<string, unknown>
  svg: React.FC<any>
}

export const dropElementConfigs: Record<UMLDiagramType, DropElementConfig[]> = {
  [UMLDiagramType.ClassDiagram]: [
    {
      type: "Package",
      width: droppedElementWidth,
      height: 120,
      defaultData: { name: "Package" },
      svg: (props) => <PackageSVG {...props} />,
    },
    {
      type: "Class",
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
      type: "Class",
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
      type: "Class",
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
      type: "Class",
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
      type: "Class",
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
  [UMLDiagramType.ActivityDiagram]: [],
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
