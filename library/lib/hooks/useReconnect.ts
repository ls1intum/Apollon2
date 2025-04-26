import { useDiagramStore } from "@/store/context"
import { OnReconnect, reconnectEdge } from "@xyflow/react"
import { useCallback } from "react"
import { useShallow } from "zustand/shallow"

export const useReconnect = () => {
  const setEdges = useDiagramStore(useShallow((state) => state.setEdges))

  const onReconnect: OnReconnect = useCallback((oldEdge, newConnection) => {
    setEdges((els) => reconnectEdge(oldEdge, newConnection, els))
  }, [])

  return { onReconnect }
}
