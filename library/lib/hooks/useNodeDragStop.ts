import { useCallback } from "react"
import { type OnNodeDrag, type Node, useReactFlow } from "@xyflow/react"
import {
  getAllChildrenIds,
  getAllParents,
  getPositionOnCanvas,
  resizeAllParents,
  sortParentsFirst,
} from "@/utils"

export const useNodeDragStop = () => {
  const { setNodes, getNodes, getIntersectingNodes } = useReactFlow()
  const onNodeDragStop: OnNodeDrag<Node> = useCallback((event, node) => {
    console.log("onNodeDragStop event:", event)

    const isDropnodeDroppable = node.type === "package"
    if (!isDropnodeDroppable) {
      const intersectionsWithDroppableNodes = getIntersectingNodes({
        id: node.id,
      }).filter((n) => n.type === "package")

      const allParents = getAllParents(node, intersectionsWithDroppableNodes)

      const nonRelatives = intersectionsWithDroppableNodes.filter(
        (n) => !allParents.includes(n.id)
      )

      const newParent = nonRelatives.length > 0 ? nonRelatives.at(-1) : null

      if (newParent) {
        const droppableNode = newParent

        const allNodes = getNodes()
        const nodePositionOnCanvas = getPositionOnCanvas(node, allNodes)
        const newParentPositionOnCanvas = getPositionOnCanvas(
          droppableNode,
          allNodes
        )

        console.log("nodePositionOnCanvas", nodePositionOnCanvas)
        console.log("newParentPositionOnCanvas", newParentPositionOnCanvas)
        const updateNode = {
          ...node,
          parentId: droppableNode.id,
          expandParent: true,
          position: {
            x: nodePositionOnCanvas.x - newParentPositionOnCanvas.x,
            y: nodePositionOnCanvas.y - newParentPositionOnCanvas.y,
          },
        }

        const resizedParents = resizeAllParents(updateNode, allNodes)

        const newNodes = sortParentsFirst(resizedParents)

        setNodes(newNodes)
      }
    } else {
      const intersections = getIntersectingNodes({
        id: node.id,
      }).filter((n) => n.type === "package")

      const allParents = getAllParents(node, intersections)
      const allChildren = getAllChildrenIds(node, intersections)

      const nonRelatives = intersections.filter(
        (n) => !allParents.includes(n.id) && !allChildren.includes(n.id)
      )

      const newParent = nonRelatives.length > 0 ? nonRelatives.at(-1) : null

      console.log("DEBUG: allParents", allParents)
      console.log("DEBUG: allChildren", allChildren)
      console.log("DEBUG: intersections", intersections)
      console.log("DEBUG: nonRelatives", nonRelatives)
      console.log("DEBUG: newParent", newParent)

      if (newParent) {
        const allNodes = getNodes()
        const nodePositionOnCanvas = getPositionOnCanvas(node, allNodes)
        const newParentPositionOnCanvas = getPositionOnCanvas(
          newParent,
          allNodes
        )

        console.log("newParent", newParent)
        console.log("node", node)

        if (node.parentId != newParent.id) {
          const updateNode = {
            ...node,
            parentId: newParent.id,
            expandParent: true,
            position: {
              x: nodePositionOnCanvas.x - newParentPositionOnCanvas.x,
              y: nodePositionOnCanvas.y - newParentPositionOnCanvas.y,
            },
          }
          const resizedParents = resizeAllParents(updateNode, allNodes)

          const newNodes = sortParentsFirst(resizedParents)
          setNodes(newNodes)
        }
      }
    }
  }, [])

  return { onNodeDragStop }
}
