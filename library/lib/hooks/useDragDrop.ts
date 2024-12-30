import { DropNodeData } from "@/types"
import { generateUUID } from "@/utils"
import { useReactFlow, type Node } from "@xyflow/react"
import { useCallback, DragEvent } from "react"

export const useDragDrop = () => {
  const { screenToFlowPosition, setNodes } = useReactFlow()

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault()
      const data = JSON.parse(
        event.dataTransfer.getData("text/plain")
      ) as DropNodeData

      // check if the dropped element is valid
      if (!data.type) {
        return
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })
      const newNode: Node = {
        width: 200,
        height: 110,
        id: generateUUID(),
        type: data.type,
        position,
        data: data.data,
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [screenToFlowPosition]
  )

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  return { onDrop, onDragOver }
}
