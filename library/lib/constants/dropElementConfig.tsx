/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClassSVG, PackageSVG } from "@/components"
import { DiagramType, ClassType } from "@/types"
import { DiagramNodeTypeKeys } from "@/nodes"

export * from "./layoutConstants"
export const transformScale = 0.8

const droppedElementWidth = 160

export type DropElementConfig = {
  type: DiagramNodeTypeKeys
  width: number
  height: number
  defaultData: Record<string, unknown>
  svg: React.FC<any>
}

export const dropElementConfigs: Record<DiagramType, DropElementConfig[]> = {
  [DiagramType.ClassDiagram]: [
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
        methods: [{ name: "+ method()" }], // No id here
        attributes: [{ name: "+ attribute: Type" }], // No id here
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
        methods: [{ name: "+ method()" }],
        attributes: [{ name: "+ attribute: Type" }],
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
          { name: "Case 1" },
          { name: "Case 2" },
          { name: "Case 3" },
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
        methods: [{ name: "+ method()" }],
        attributes: [{ name: "+ attribute: Type" }],
      },
      svg: (props) => <ClassSVG {...props} />,
    },
  ],
  [DiagramType.ObjectDiagram]: [
    {
      type: "class",
      width: droppedElementWidth,
      height: 70,
      defaultData: {
        name: "Object",
        stereotype: ClassType.ObjectClass,
        attributes: [{ name: "attribute = value" }],
        methods: [],
      },
      svg: (props) => <ClassSVG {...props} />,
    },
  ],
}
