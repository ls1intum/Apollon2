import { useCallback } from "react"
import { type OnNodeDrag, type Node, useReactFlow } from "@xyflow/react"
import { getPositionOnCanvas, resizeAllParents } from "@/utils"

export const useNodeDragStop = () => {
  const {
    screenToFlowPosition,
    updateNode,
    getNodes,
    getIntersectingNodes,
    setNodes,
  } = useReactFlow()

  const onNodeDragStop: OnNodeDrag<Node> = useCallback(
    (event, draggedNode) => {
      const nodes = getNodes()
      const draggedLastPoint = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      const intersectionsWithDroppedLocation = getIntersectingNodes({
        x: draggedLastPoint.x,
        y: draggedLastPoint.y,
        width: 5,
        height: 5,
      }).filter((n) => n.type === "package" && n.id !== draggedNode.id)

      const parentNode = intersectionsWithDroppedLocation.length
        ? intersectionsWithDroppedLocation[
            intersectionsWithDroppedLocation.length - 1
          ]
        : null

      if (!parentNode) {
        updateNode(draggedNode.id, {
          position: getPositionOnCanvas(draggedNode, nodes),
          parentId: undefined,
        })
        return
      }

      const isThisNewParent =
        parentNode && parentNode?.id !== draggedNode.parentId

      if (isThisNewParent) {
        const updatedNode: Node = {
          ...structuredClone(draggedNode),
          position: getPositionOnCanvas(draggedNode, nodes),
          parentId: undefined,
        }
        const parentsFlowPosition = getPositionOnCanvas(parentNode, nodes)

        updatedNode.position.x -= parentsFlowPosition.x
        updatedNode.position.y -= parentsFlowPosition.y
        updatedNode.parentId = parentNode.id
        console.log("updatedNode,", updateNode)
        const updatedNodesList = resizeAllParents(
          updatedNode,
          nodes.map((n) => (n.id === updatedNode.id ? updatedNode : n))
        )

        setNodes(updatedNodesList)
        return
      }

      if (draggedNode.parentId) {
        const updatedNodesList = resizeAllParents(
          draggedNode,
          nodes.map((n) => n)
        )
        setNodes(updatedNodesList)
      }
    },
    [screenToFlowPosition, updateNode, getNodes, getIntersectingNodes, setNodes]
  )

  return { onNodeDragStop }
}
