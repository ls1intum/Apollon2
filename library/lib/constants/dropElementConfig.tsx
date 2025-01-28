/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClassSVG, PackageSVG, ColorDescriptionSVG } from "@/components"
import { generateUUID } from "@/utils"
import { ClassType } from "@/types"
import { DiagramNodeTypeKeys } from "@/nodes"

export * from "./layoutConstants"
export const transformScale = 0.8

const droppedElementWidth = 160

export const dropElementConfig: {
  type: DiagramNodeTypeKeys
  name: string
  width: number
  height: number
  defaultData: Record<string, unknown>
  svg: React.FC<any>
}[] = [
  {
    type: "package",
    name: "Package",
    width: droppedElementWidth,
    height: 120,
    defaultData: { name: "Package" },
    svg: (props) => <PackageSVG {...props} />,
  },
  {
    type: "class",
    name: "Class",
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
    name: "Abstract",
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
    name: "Enumeration",
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
    name: "Interface",
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
  {
    type: "colorDescription",
    name: "Color Description",
    width: droppedElementWidth,
    height: 48,
    defaultData: { description: "Color Description" },
    svg: (props) => <ColorDescriptionSVG {...props} />,
  },
]
