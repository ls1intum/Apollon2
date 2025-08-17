import { useCallback } from "react"
import { useReactFlow } from "@xyflow/react"
import {
  findClosestHandle,
  findClosestHandleForInterface,
} from "../utils/edgeUtils"
import { DiagramNodeTypeRecord } from "../nodes"
import { IPoint } from "../edges/Connection"

export const useHandleFinder = () => {
  const { getNodes, screenToFlowPosition } = useReactFlow()

  const findNodeAtPosition = (position: IPoint) => {
    const nodes = getNodes()
    return nodes.find((node) => {
      const x = node.position?.x || 0
      const y = node.position?.y || 0
      const width = node.width || 100
      const height = node.height || 160

      return (
        position.x > x &&
        position.x < x + width &&
        position.y > y &&
        position.y < y + height
      )
    })
  }

  const findBestHandle = useCallback(
    (upEvent: PointerEvent) => {
      const dropPosition = screenToFlowPosition({
        x: upEvent.clientX,
        y: upEvent.clientY,
      })
      const nodeAtPosition = findNodeAtPosition(dropPosition)

      if (!nodeAtPosition) {
        return {
          handle: null,
          node: null,
          shouldClearPoints: true,
        }
      }

      const nodeBounds = {
        x: nodeAtPosition.position.x,
        y: nodeAtPosition.position.y,
        width: nodeAtPosition.width!,
        height: nodeAtPosition.height!,
      }

      let handle: string
      if (nodeAtPosition.type === DiagramNodeTypeRecord.componentInterface) {
        handle = findClosestHandleForInterface(dropPosition, nodeBounds)
      } else {
        handle = findClosestHandle(dropPosition, nodeBounds)
      }

      return {
        handle,
        node: nodeAtPosition,
        shouldClearPoints: false,
      }
    },
    [getNodes, screenToFlowPosition]
  )

  return { findBestHandle }
}
