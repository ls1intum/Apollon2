import { OnNodeDrag, useReactFlow, type Node } from "@xyflow/react"
import { useCallback } from "react"

export const useNodeDragStart = () => {
  const { updateNode } = useReactFlow()

  const onNodeDragStart: OnNodeDrag<Node> = useCallback(
    (_, node) => {
      updateNode(node.id, { expandParent: false }, { replace: true })
    },
    [updateNode]
  )

  return { onNodeDragStart }
}
