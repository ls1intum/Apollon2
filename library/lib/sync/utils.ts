import { type Node, type NodeOrigin, type Rect, Box } from "@xyflow/react"
// @todo import from @xyflow/react when fixed
import { boxToRect, getNodePositionWithOrigin, rectToBox } from "@xyflow/system"

// we have to make sure that parent nodes are rendered before their children
export const sortNodes = (a: Node, b: Node): number => {
  if (a.type === b.type) {
    return 0
  }
  return a.type === "package" && b.type !== "package" ? -1 : 1
}

export const getId = (prefix = "node") => `${prefix}_${Math.random() * 10000}`

export const getNodePositionInsideParent = (
  node: Partial<Node>,
  groupNode: Node
) => {
  const position = node.position ?? { x: 0, y: 0 }
  const nodeWidth = node.measured?.width ?? 0
  const nodeHeight = node.measured?.height ?? 0
  const groupWidth = groupNode.measured?.width ?? 0
  const groupHeight = groupNode.measured?.height ?? 0

  if (position.x < groupNode.position.x) {
    position.x = 0
  } else if (position.x + nodeWidth > groupNode.position.x + groupWidth) {
    position.x = groupWidth - nodeWidth
  } else {
    position.x = position.x - groupNode.position.x
  }

  if (position.y < groupNode.position.y) {
    position.y = 0
  } else if (position.y + nodeHeight > groupNode.position.y + groupHeight) {
    position.y = groupHeight - nodeHeight
  } else {
    position.y = position.y - groupNode.position.y
  }

  return position
}

export const getBoundsOfBoxes = (box1: Box, box2: Box): Box => ({
  x: Math.min(box1.x, box2.x),
  y: Math.min(box1.y, box2.y),
  x2: Math.max(box1.x2, box2.x2),
  y2: Math.max(box1.y2, box2.y2),
})

export const getRelativeNodesBounds = (
  nodes: Node[],
  nodeOrigin: NodeOrigin = [0, 0]
): Rect => {
  if (nodes.length === 0) {
    return { x: 0, y: 0, width: 0, height: 0 }
  }

  const box = nodes.reduce(
    (currBox, node) => {
      const { x, y } = getNodePositionWithOrigin(node, nodeOrigin)
      return getBoundsOfBoxes(
        currBox,
        rectToBox({
          x,
          y,
          width: node.width || 0,
          height: node.height || 0,
        })
      )
    },
    { x: Infinity, y: Infinity, x2: -Infinity, y2: -Infinity }
  )

  return boxToRect(box)
}

export function stringToColor(str: string) {
  let colour = "#"
  let hash = 0

  for (const char of str) {
    hash = char.charCodeAt(0) + (hash << 5) - hash
  }

  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff
    colour += value.toString(16).substring(-2)
  }

  return colour.substring(0, 7)
}
