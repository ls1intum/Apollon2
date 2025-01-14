import { XYPosition, type Node } from "@xyflow/react"

export const sortParentsFirst = (items: Node[]) => {
  const idMap = new Map()
  items.forEach((item) => idMap.set(item.id, item))

  const sorted: Node[] = []
  const visited = new Set()
  const temp = new Set()

  function visit(item: Node) {
    if (visited.has(item.id)) {
      return
    }
    if (temp.has(item.id)) {
      throw new Error("Cycle detected in parent-child relationships.")
    }
    temp.add(item.id)

    if (item.parentId) {
      const parent = idMap.get(item.parentId)
      if (parent) {
        visit(parent)
      } else {
        console.warn(
          `Parent with id ${item.parentId} not found for item ${item.id}`
        )
      }
    }

    temp.delete(item.id)
    visited.add(item.id)
    sorted.push(item)
  }

  items.forEach((item) => {
    try {
      visit(item)
    } catch (e: unknown) {
      console.error("error during sorting nodes", e)
      // Handle the cycle as needed, e.g., skip the item or halt the sorting
    }
  })

  return sorted
}

export const getAllParents = (item: Node, items: Node[]) => {
  const parents: string[] = []

  let parent = items.find((n) => n.id === item.parentId)
  while (parent) {
    parents.push(parent.id)
    parent = items.find((n) => n.id === parent!.parentId)
  }
  return parents
}

export const getAllChildrenIds = (item: Node, list: Node[]) => {
  const children = list.filter((child) => child.parentId === item.id)
  let allChildrenIds: string[] = []

  for (const child of children) {
    allChildrenIds.push(child.id)
    // Recursively get the children of the current child
    allChildrenIds = allChildrenIds.concat(getAllChildrenIds(child, list))
  }

  return allChildrenIds
}

export const getPositionOnCanvas = (
  node: Node,
  allNodes: Node[]
): XYPosition => {
  let parent = node.parentId
    ? allNodes.find((n) => n.id === node.parentId)
    : null
  const position = node.position
  while (parent) {
    console.log("DEBUG: parent", parent)
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
  let updatedNodes = [...allNodes]

  while (currentNode.parentId) {
    const parent = updatedNodes.find((n) => n.id === currentNode.parentId)!
    console.log("DEBUG: before changes currentNode", currentNode)
    console.log("DEBUG: before changes parent", parent)

    if (currentNode.position.x < 0) {
      parent.position.x = parent.position.x + currentNode.position.x
      parent.width = parent.width! - currentNode.position.x
      currentNode.position.x = 0
    }
    if (currentNode.position.y < 0) {
      parent.position.y = parent.position.y + currentNode.position.y
      parent.height = parent.height! - currentNode.position.y
      currentNode.position.y = 0
    }
    if (currentNode.position.x + currentNode.width! > parent.width!) {
      parent.width = currentNode.position.x + currentNode.width!
    }
    if (currentNode.position.y + currentNode.height! > parent.height!) {
      parent.height = currentNode.position.y + currentNode.height!
    }

    console.log("DEBUG: after changes currentNode", currentNode)
    console.log("DEBUG: after changes parent", parent)
    updatedNodes = updatedNodes.map((n) =>
      n.id === currentNode.id ? currentNode : n.id === parent.id ? parent : n
    )
    currentNode = updatedNodes.find((n) => n.id === currentNode.parentId)!
  }

  console.log("DEBUG: updatedNodes", updatedNodes)
  return updatedNodes
}
