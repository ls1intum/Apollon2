import { XYPosition, type Node } from "@xyflow/react"

export const getPositionOnCanvas = (
  node: Node,
  allNodes: Node[]
): XYPosition => {
  // we need to copy position object here, otherwise updates node's position
  const position: XYPosition = { x: node.position.x, y: node.position.y }
  let parent = node.parentId
    ? allNodes.find((n) => n.id === node.parentId)
    : null

  while (parent) {
    position.x = position.x + parent.position.x
    position.y = position.y + parent.position.y

    parent = parent.parentId
      ? allNodes.find((n) => n.id === parent!.parentId)
      : null
  }

  return position
}

export const resizeAllParents = (node: Node, allNodes: Node[]) => {
  let currentNode = node

  while (currentNode.parentId) {
    const parent = allNodes.find((n) => n.id === currentNode.parentId)!
    const allChildren = allNodes.filter((n) => n.parentId === parent.id)

    if (currentNode.position.x < 0) {
      console.log("DEBUG: currentNode.position.x < 0")
      const parentPositionUpdateOffsetX = -1 * currentNode.position.x
      parent.position.x = parent.position.x - parentPositionUpdateOffsetX
      parent.width = parent.width! + parentPositionUpdateOffsetX
      allChildren.forEach((child) => {
        child.position.x = child.position.x + parentPositionUpdateOffsetX
      })
    }
    if (currentNode.position.y < 0) {
      console.log("DEBUG: currentNode.position.y < 0")
      const parentPositionUpdateOffsetY = -1 * currentNode.position.y
      parent.position.y = parent.position.y - parentPositionUpdateOffsetY
      parent.height = parent.height! + parentPositionUpdateOffsetY
      allChildren.forEach((child) => {
        child.position.y = child.position.y + parentPositionUpdateOffsetY
      })
    }
    if (currentNode.position.x + currentNode.width! > parent.width!) {
      console.log(
        "DEBUG: currentNode.position.x + currentNode.width! > parent.width!"
      )
      parent.width = currentNode.position.x + currentNode.width!
    }
    if (currentNode.position.y + currentNode.height! > parent.height!) {
      console.log(
        "DEBUG: currentNode.position.y + currentNode.height! > parent.height!"
      )
      parent.height = currentNode.position.y + currentNode.height!
    }

    currentNode = allNodes.find((n) => n.id === currentNode.parentId)!
  }
  return allNodes
}
