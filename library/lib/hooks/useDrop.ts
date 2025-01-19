import { dropElementConfig } from "@/constants"
import { DropNodeData } from "@/types"
import { generateUUID, getPositionOnCanvas, resizeAllParents } from "@/utils"
import { useReactFlow, type Node } from "@xyflow/react"
import { useCallback, DragEvent } from "react"

export const useDrop = () => {
  const { screenToFlowPosition, setNodes, getIntersectingNodes, getNodes } =
    useReactFlow()

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault()
      const dropData = JSON.parse(
        event.dataTransfer.getData("text/plain")
      ) as DropNodeData

      const config = dropElementConfig.find(
        (config) => config.type === dropData.type
      )
      // Validate the dropped element type
      if (!config) {
        console.warn(`Unknown drop element type: ${dropData.type}`)
        return
      }
      // Convert the drop position to the flow position
      const dropPosition = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      // Adjust position by subtracting the offset
      const position = {
        x: dropPosition.x - dropData.offsetX,
        y: dropPosition.y - dropData.offsetY,
      }
      const intersectionsWithDroppableNodes = getIntersectingNodes({
        x: dropPosition.x,
        y: dropPosition.y,
        width: 5,
        height: 5,
      }).filter((n) => n.type === "package")

      const parentNode =
        intersectionsWithDroppableNodes[
          intersectionsWithDroppableNodes.length - 1
        ]

      const parentId = parentNode ? parentNode.id : undefined
      const allNodes = getNodes()

      const newNode: Node = {
        width: config.width,
        height: config.height,
        id: generateUUID(),
        type: dropData.type,
        position,
        data: { ...config.defaultData, ...dropData.data },
        parentId,
      }
      if (parentId) {
        const parentPositionOnCanvas = getPositionOnCanvas(parentNode, allNodes)
        newNode.position.x = newNode.position.x - parentPositionOnCanvas.x
        newNode.position.y = newNode.position.y - parentPositionOnCanvas.y
      }

      const newNodesList = allNodes.concat(newNode)
      if (parentId) {
        resizeAllParents(newNode, newNodesList)
      }

      setNodes(newNodesList)
    },
    [
      screenToFlowPosition,
      setNodes,
      getIntersectingNodes,
      getNodes,
      generateUUID,
      getPositionOnCanvas,
      resizeAllParents,
    ]
  )

  return { onDrop }
}
