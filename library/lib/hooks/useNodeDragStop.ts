import { Dispatch, SetStateAction, useCallback } from "react"
import { type OnNodeDrag, type Node, useReactFlow } from "@xyflow/react"
import {
  getPositionOnCanvas,
  resizeAllParents,
  sortNodesTopologically,
} from "@/utils"

export const useNodeDragStop = (
  setNodesState: Dispatch<SetStateAction<Node[]>>
) => {
  const { getNodes, screenToFlowPosition, getIntersectingNodes, updateNode } =
    useReactFlow()

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

        const sortedList = sortNodesTopologically(updatedNodesList)
        setNodesState(sortedList)
        return
      }

      if (draggedNode.parentId) {
        const updatedNodesList = resizeAllParents(
          draggedNode,
          nodes.map((n) => n)
        )
        setNodesState(updatedNodesList)
      }
    },
    [
      screenToFlowPosition,
      updateNode,
      getNodes,
      getIntersectingNodes,
      setNodesState,
    ]
  )

  return { onNodeDragStop }
}
