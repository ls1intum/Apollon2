import { getPositionOnCanvas } from "@/utils"
import { OnNodeDrag, useReactFlow, type Node } from "@xyflow/react"
import { useCallback } from "react"

export const useNodeDragStart = () => {
  const { updateNode, getNodes } = useReactFlow()

  const onNodeDragStart: OnNodeDrag<Node> = useCallback(
    (_, node) => {
      const allNodes = getNodes()
      const nodePosition = getPositionOnCanvas(node, allNodes)

      updateNode(node.id, { parentId: undefined, position: nodePosition })
    },
    [getNodes, updateNode]
  )

  return { onNodeDragStart }
}
