import { type Edge, type Node } from "@xyflow/react"
// import { ClassType } from "./types"

export const initialNodes: Node[] = [
  {
    id: "11",
    type: "package",
    position: { x: 0, y: 0 },
    width: 200,
    height: 200,
    data: { name: "11" },
  },
  // {
  //   id: "22",
  //   type: "package",
  //   position: { x: -100, y: 500 },
  //   width: 200,
  //   height: 200,
  //   data: { name: "22" },
  // },
  // {
  //   id: "3",
  //   type: "package",
  //   position: { x: 300, y: 500 },
  //   width: 150,
  //   height: 150,
  //   data: { name: "Package" },
  // },
  // {
  //   id: "4",
  //   type: "package",
  //   position: { x: 500, y: 500 },
  //   width: 700,
  //   height: 800,
  //   data: { name: "Package" },
  // },
  // {
  //   id: "aaaa",
  //   type: "class",
  //   position: { x: 20, y: 30 },
  //   width: 296,
  //   height: 170,
  //   parentId: "1asdasdadasda",
  //   expandParent: false,
  //   data: {
  //     name: "Class",
  //     methods: [
  //       { id: "1", name: "method1" },
  //       { id: "2", name: "method2" },
  //     ],
  //     attributes: [
  //       { id: "1", name: "attribute1" },
  //       { id: "2", name: "attribute2" },
  //     ],
  //   },
  // },
  // {
  //   id: "3",
  //   type: "class",
  //   position: { x: 400, y: 100 },
  //   width: 296,
  //   height: 170,
  //   selected: false,
  //   data: {
  //     stereotype: ClassType.Abstract,
  //     name: "AbstractClass",
  //     methods: [
  //       { id: "1", name: "method1" },
  //       { id: "2", name: "method2" },
  //     ],
  //     attributes: [
  //       { id: "1", name: "attribute1" },
  //       { id: "2", name: "attribute2" },
  //     ],
  //   },
  // },
  // {
  //   id: "4",
  //   type: "class",
  //   position: { x: 400, y: 300 },
  //   width: 296,
  //   height: 170,
  //   selected: false,
  //   data: {
  //     name: "InterfaceClass",
  //     stereotype: ClassType.Interface,
  //     methods: [
  //       { id: "1", name: "method1" },
  //       { id: "2", name: "method2" },
  //     ],
  //     attributes: [
  //       { id: "1", name: "attribute1" },
  //       { id: "2", name: "attribute2" },
  //     ],
  //   },
  // },
  // {
  //   id: "5",
  //   type: "class",
  //   position: { x: 400, y: 500 },
  //   width: 296,
  //   height: 170,
  //   selected: false,
  //   data: {
  //     name: "EnumerationClass",
  //     stereotype: ClassType.Enumeration,
  //     methods: [
  //       { id: "1", name: "method1" },
  //       { id: "2", name: "method2" },
  //     ],
  //     attributes: [
  //       { id: "1", name: "attribute1" },
  //       { id: "2", name: "attribute2" },
  //     ],
  //   },
  // },
  // {
  //   id: "6",
  //   type: "colorDescription",
  //   position: { x: -100, y: 600 },
  //   width: 160,
  //   height: 50,
  //   selected: false,
  //   data: {
  //     description: "Color description",
  //   },
  // },

  // Testing TitleAndDescription
  // {
  //   id: "99",
  //   type: "titleAndDesctiption",
  //   position: { x: -100, y: 100 },
  //   width: 160,
  //   height: 200,
  //   selected: false,
  //   data: {
  //     title: "Title",
  //     description:
  //       "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  //   },
  // },
]

export const initialEdges: Edge[] = [
  // {
  //   id: "1->2",
  //   source: "1",
  //   target: "2",
  //   type: "step",
  // },
  // {
  //   id: "2->3",
  //   source: "2",
  //   target: "3",
  //   type: "realization",
  // },
  // {
  //   id: "3->4",
  //   source: "3",
  //   target: "4",
  //   type: "aggregation",
  // },
  // {
  //   id: "4->5",
  //   source: "4",
  //   target: "5",
  //   type: "composition",
  // },
  // {
  //   id: "5->1",
  //   source: "5",
  //   target: "1",
  //   type: "dependency",
  // },
]
