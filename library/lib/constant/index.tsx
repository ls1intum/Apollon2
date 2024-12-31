/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClassSVG, PackageSVG, ColorDescriptionSVG } from "@/svgs"
import { generateUUID } from "@/utils"
import { ClassType } from "@/types"
import { DiagramNodeTypeKeys } from "@/nodes"

export const transformScale = 0.8
const droppedElementWidth = 160
const droppedElementHeight = 110

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
    height: droppedElementHeight,
    defaultData: { name: "Package" },
    svg: (props) => <PackageSVG {...props} />,
  },
  {
    type: "class",
    name: "Class",
    width: droppedElementWidth,
    height: droppedElementHeight,
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
    height: droppedElementHeight,
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
    height: droppedElementHeight,
    defaultData: {
      name: "Enumeration",
      stereotype: ClassType.Enumeration,
      methods: [{ id: generateUUID(), name: "+ method()" }],
      attributes: [{ id: generateUUID(), name: "+ attribute: Type" }],
    },
    svg: (props) => <ClassSVG {...props} />,
  },
  {
    type: "class",
    name: "Interface",
    width: droppedElementWidth,
    height: droppedElementHeight,
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
