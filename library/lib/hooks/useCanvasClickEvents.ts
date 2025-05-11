import { useDiagramStore } from "@/store/context"
import { useCallback, MouseEvent } from "react"
import { useShallow } from "zustand/shallow"
import { type Node, type Edge } from "@xyflow/react"

export const useCanvasClickEvents = () => {
  const { interactiveElementId, setInteractiveElementId } = useDiagramStore(
    useShallow((state) => ({
      interactiveElementId: state.interactiveElementId,
      setInteractiveElementId: state.setInteractiveElementId,
    }))
  )

  const onNodeClick = useCallback(
    (_: MouseEvent, node: Node) => {
      console.log("Node clicked:", node)
      setInteractiveElementId(node.id)
    },
    [setInteractiveElementId]
  )

  const onEdgeClick = useCallback(
    (_: MouseEvent, edge: Edge) => {
      setInteractiveElementId(edge.id)
    },
    [setInteractiveElementId]
  )

  const onPaneClick = useCallback(() => {
    console.log("Pane clicked")
    if (interactiveElementId) {
      setInteractiveElementId(null)
    }
  }, [interactiveElementId, setInteractiveElementId])

  return {
    onNodeClick,
    onEdgeClick,
    onPaneClick,
  }
}
