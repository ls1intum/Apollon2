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
      const parentPositionUpdateOffsetX = -1 * currentNode.position.x
      parent.position.x = parent.position.x - parentPositionUpdateOffsetX
      parent.width = parent.width! + parentPositionUpdateOffsetX
      allChildren.forEach((child) => {
        child.position.x = child.position.x + parentPositionUpdateOffsetX
      })
    }
    if (currentNode.position.y < 0) {
      const parentPositionUpdateOffsetY = -1 * currentNode.position.y
      parent.position.y = parent.position.y - parentPositionUpdateOffsetY
      parent.height = parent.height! + parentPositionUpdateOffsetY
      allChildren.forEach((child) => {
        child.position.y = child.position.y + parentPositionUpdateOffsetY
      })
    }
    if (currentNode.position.x + currentNode.width! > parent.width!) {
      parent.width = currentNode.position.x + currentNode.width!
    }
    if (currentNode.position.y + currentNode.height! > parent.height!) {
      parent.height = currentNode.position.y + currentNode.height!
    }

    currentNode = allNodes.find((n) => n.id === currentNode.parentId)!
  }
  return allNodes
}

export function resizeAllParents2(child: Node, nodes: Node[]) {
  let currentNode = child
  while (currentNode.parentId) {
    const parent = nodes.find((n) => n.id === currentNode.parentId)
    if (!parent) break

    // Adjust parent position and size if child has negative coordinates
    const offsetX = Math.min(0, currentNode.position.x)
    const offsetY = Math.min(0, currentNode.position.y)

    if (offsetX < 0 || offsetY < 0) {
      // Shift parent to the new top-left corner
      parent.position.x += offsetX
      parent.position.y += offsetY

      // Expand parent dimensions to cover the child fully
      parent.width = Math.max(
        parent.width || 0,
        currentNode.position.x + (currentNode.width || 0) - offsetX
      )
      parent.height = Math.max(
        parent.height || 0,
        currentNode.position.y + (currentNode.height || 0) - offsetY
      )

      // Adjust all other child nodes within this parent
      nodes.forEach((n) => {
        if (n.parentId === parent.id) {
          n.position.x -= offsetX
          n.position.y -= offsetY
        }
      })
    }

    currentNode = parent // Move up to next parent in the hierarchy
  }
}

export function sortNodesTopologically(nodes: Node[]): Node[] {
  const nodeMap = new Map<string, Node>()
  nodes.forEach((node) => nodeMap.set(node.id, node))

  const sorted: Node[] = []
  const visited = new Set<string>()
  const visiting = new Set<string>()

  const visit = (node: Node) => {
    if (visited.has(node.id)) return
    if (visiting.has(node.id)) {
      throw new Error(`Circular dependency detected at node ${node.id}`)
    }

    visiting.add(node.id)

    if (node.parentId) {
      const parentNode = nodeMap.get(node.parentId)
      if (parentNode) {
        visit(parentNode)
      } else {
        console.warn(
          `Parent node with id ${node.parentId} not found for node ${node.id}`
        )
      }
    }

    visiting.delete(node.id)
    visited.add(node.id)
    sorted.push(node)
  }

  nodes.forEach((node) => {
    if (!visited.has(node.id)) {
      visit(node)
    }
  })

  return sorted
}
