import { Dispatch, SetStateAction, useCallback } from "react"
import { type OnNodeDrag, type Node, useReactFlow } from "@xyflow/react"
import { getPositionOnCanvas, resizeAllParents } from "@/utils"
import { MOUSE_UP_OFFSET_IN_PIXELS } from "@/constants"

export const useNodeDragStop = (
  nodes: Node[],
  setNodesState: Dispatch<SetStateAction<Node[]>>
) => {
  const { screenToFlowPosition, getIntersectingNodes } = useReactFlow()

  const onNodeDragStop: OnNodeDrag<Node> = useCallback(
    (event, draggedNode) => {
      const draggedLastPoint = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      const intersectionsWithDroppedLocation = getIntersectingNodes({
        x: draggedLastPoint.x,
        y: draggedLastPoint.y,
        width: MOUSE_UP_OFFSET_IN_PIXELS,
        height: MOUSE_UP_OFFSET_IN_PIXELS,
      }).filter((n) => n.type === "package" && n.id !== draggedNode.id)

      const parentNode = intersectionsWithDroppedLocation.length
        ? intersectionsWithDroppedLocation[
            intersectionsWithDroppedLocation.length - 1
          ]
        : null

      if (!parentNode) {
        setNodesState((valuse) =>
          valuse.map((n) =>
            n.id === draggedNode.id
              ? {
                  ...draggedNode,
                  position: getPositionOnCanvas(draggedNode, nodes),
                  parentId: undefined,
                }
              : n
          )
        )
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

        const updatedNodesList = resizeAllParents(
          updatedNode,
          nodes.map((n) => (n.id === updatedNode.id ? updatedNode : n))
        )

        setNodesState(updatedNodesList)
        // const sortedList = sortNodesTopologically(updatedNodesList)
        // console.log("sortedList", sortedList)
        // setNodesState(sortedList)
        return
      }

      if (draggedNode.parentId) {
        const updatedNodesList = resizeAllParents(
          draggedNode,
          nodes.map((n) => (n.id === draggedNode.id ? { ...draggedNode } : n))
        )
        setNodesState(updatedNodesList)
      }
    },
    [screenToFlowPosition, nodes, getIntersectingNodes, setNodesState]
  )

  return { onNodeDragStop }
}
