import { type Edge, type Node } from "@xyflow/react"

export const defaultNodes: Node[] = [
  {
    id: "1",
    type: "package",
    position: { x: -100, y: 200 },
    width: 200,
    height: 200,
    selected: false,
    data: { name: "Package" },
  },
  {
    id: "2",
    type: "class",
    position: { x: 400, y: -100 },
    width: 296,
    height: 170,
    selected: false,
    data: {
      name: "Class",
      methods: [
        { id: "1", name: "method1" },
        { id: "2", name: "method2" },
      ],
      attributes: [
        { id: "1", name: "attribute1" },
        { id: "2", name: "attribute2" },
      ],
    },
  },
  {
    id: "3",
    type: "class",
    position: { x: 400, y: 100 },
    width: 296,
    height: 170,
    selected: false,
    data: {
      stereotype: "abstract",
      name: "AbstractClass",
      methods: [
        { id: "1", name: "method1" },
        { id: "2", name: "method2" },
      ],
      attributes: [
        { id: "1", name: "attribute1" },
        { id: "2", name: "attribute2" },
      ],
    },
  },
  {
    id: "4",
    type: "class",
    position: { x: 400, y: 300 },
    width: 296,
    height: 170,
    selected: false,
    data: {
      name: "InterfaceClass",
      stereotype: "interface",
      methods: [
        { id: "1", name: "method1" },
        { id: "2", name: "method2" },
      ],
      attributes: [
        { id: "1", name: "attribute1" },
        { id: "2", name: "attribute2" },
      ],
    },
  },
  {
    id: "5",
    type: "class",
    position: { x: 400, y: 500 },
    width: 296,
    height: 170,
    selected: false,
    data: {
      name: "EnumerationClass",
      stereotype: "enumaration",
      methods: [
        { id: "1", name: "method1" },
        { id: "2", name: "method2" },
      ],
      attributes: [
        { id: "1", name: "attribute1" },
        { id: "2", name: "attribute2" },
      ],
    },
  },
  {
    id: "6",
    type: "colorDescription",
    position: { x: -100, y: 600 },
    width: 160,
    height: 50,
    selected: false,
    data: {
      description: "Color description",
    },
  },
]

export const defaultEdges: Edge[] = [
  {
    id: "1->2",
    source: "1",
    target: "2",
    sourceHandle: "right",
    targetHandle: "left",
  },
  {
    id: "2->3",
    source: "2",
    target: "3",
    sourceHandle: "bottom",
    targetHandle: "top",
  },
  {
    id: "2->4",
    source: "2",
    target: "4",
    sourceHandle: "right",
    targetHandle: "right",
  },
  {
    id: "5->3",
    source: "5",
    target: "3",
    sourceHandle: "left",
    targetHandle: "left",
  },
]
