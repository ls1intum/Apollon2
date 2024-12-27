import { type Edge, type Node } from "@xyflow/react"

export const defaultNodes: Node[] = [
  {
    id: "1",
    type: "package",
    position: { x: 300, y: 100 },
    width: 200,
    height: 200,
    selected: false,
    data: {},
  },
  {
    id: "2",
    type: "class",
    position: { x: 300, y: 450 },
    width: 296,
    height: 170,
    selected: false,
    data: {
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
]

export const defaultEdges: Edge[] = [
  {
    id: "1->2",
    source: "1",
    target: "2",
    sourceHandle: "bottom",
    targetHandle: "top",
  },
]
