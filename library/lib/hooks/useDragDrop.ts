import { dropElementConfig } from "@/constant"
import { DropNodeData } from "@/types"
import { generateUUID } from "@/utils"
import { useReactFlow, type Node } from "@xyflow/react"
import { useCallback, DragEvent } from "react"

export const useDragDrop = () => {
  const { screenToFlowPosition, setNodes } = useReactFlow()

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

      const newNode: Node = {
        width: config.width,
        height: config.height,
        id: generateUUID(),
        type: dropData.type,
        position,
        data: { ...config.defaultData, ...dropData.data },
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [screenToFlowPosition, setNodes]
  )

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  return { onDrop, onDragOver }
}
