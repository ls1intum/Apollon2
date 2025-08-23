import { useCallback } from "react"
import { type Node, useReactFlow } from "@xyflow/react"
import {
  findClosestHandle,
  findClosestHandleForInterface,
  findClosestHandleForPetriNet,
} from "../utils/edgeUtils"
import { DiagramNodeTypeRecord } from "../nodes"

interface HandleFinderResult {
  handle: string | null
  node: Node | null
  shouldClearPoints: boolean
}

export const useHandleFinder = () => {
  const { screenToFlowPosition, getIntersectingNodes, getInternalNode } =
    useReactFlow()

  const findBestHandle = useCallback(
    (upEvent: PointerEvent): HandleFinderResult => {
      const dropPosition = screenToFlowPosition({
        x: upEvent.clientX,
        y: upEvent.clientY,
      })

      const intersectingNodes = getIntersectingNodes({
        x: dropPosition.x - 1,
        y: dropPosition.y - 1,
        width: 2,
        height: 2,
      })

      if (intersectingNodes.length === 0) {
        return {
          handle: null,
          node: null,
          shouldClearPoints: true,
        }
      }
      const nodeOnTop = intersectingNodes[intersectingNodes.length - 1]
      const internalNodeData = getInternalNode(nodeOnTop.id)

      if (!internalNodeData) {
        console.warn("No internal node data found for:", nodeOnTop.id)
        return {
          handle: null,
          node: null,
          shouldClearPoints: true,
        }
      }
      if (nodeOnTop.width == null || nodeOnTop.height == null) {
        console.warn("Node dimensions not available:", nodeOnTop.id)
        return {
          handle: null,
          node: null,
          shouldClearPoints: true,
        }
      }
      const nodeBounds = {
        x: internalNodeData.internals.positionAbsolute.x,
        y: internalNodeData.internals.positionAbsolute.y,
        width: nodeOnTop.width,
        height: nodeOnTop.height,
      }
      let handle: string
      if (nodeOnTop.type === DiagramNodeTypeRecord.componentInterface) {
        handle = findClosestHandleForInterface(dropPosition, nodeBounds)
      } else if (
        nodeOnTop.type === "petriNetPlace" ||
        nodeOnTop.type === "petriNetTransition"
      ) {
        handle = findClosestHandleForPetriNet(dropPosition, nodeBounds)
      } else {
        handle = findClosestHandle(dropPosition, nodeBounds)
      }
      return {
        handle,
        node: nodeOnTop,
        shouldClearPoints: false,
      }
    },
    [screenToFlowPosition, getIntersectingNodes, getInternalNode]
  )

  return { findBestHandle }
}
