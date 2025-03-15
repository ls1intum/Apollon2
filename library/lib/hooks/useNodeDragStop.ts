import { useCallback } from "react"
import { type OnNodeDrag, type Node, useReactFlow } from "@xyflow/react"
import { getPositionOnCanvas, resizeAllParents } from "@/utils"
import { MOUSE_UP_OFFSET_IN_PIXELS } from "@/constants"
import useDiagramStore from "@/store/diagramStore"
import { useShallow } from "zustand/react/shallow"

export const useNodeDragStop = () => {
  const { screenToFlowPosition, getIntersectingNodes } = useReactFlow()
  const { setNodes, nodes } = useDiagramStore(
    useShallow((state) => ({ setNodes: state.setNodes, nodes: state.nodes }))
  )

  const onNodeDragStop: OnNodeDrag<Node> = useCallback(
    (event, draggedNode) => {
      const draggedLastPoint = screenToFlowPosition({
        x:
          "changedTouches" in event
            ? // event is handled as Mouse event in the library but also it is touch event for mobile users
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (event as any as TouchEvent).changedTouches[0].clientX
            : event.clientX,
        y:
          "changedTouches" in event
            ? // event is handled as Mouse event in the library but also it is touch event for mobile users
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (event as any as TouchEvent).changedTouches[0].clientY
            : event.clientY,
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
        setNodes(
          nodes.map((n) =>
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

        setNodes(updatedNodesList)
        return
      }

      if (draggedNode.parentId) {
        const updatedNodesList = resizeAllParents(
          draggedNode,
          nodes.map((n) => (n.id === draggedNode.id ? { ...draggedNode } : n))
        )
        setNodes(updatedNodesList)
      }
    },
    [screenToFlowPosition, nodes, getIntersectingNodes, setNodes]
  )

  return { onNodeDragStop }
}
