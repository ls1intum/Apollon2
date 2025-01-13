import {
    reconnectEdge,
    Edge,
    Connection,
    useReactFlow
  } from "@xyflow/react"
import { useCallback} from "react"

export const useReconnect = () => {

  const { setEdges} = useReactFlow()
  const onReconnect = useCallback(
    (oldEdge: Edge, newConnection: Connection) =>
      setEdges((els) =>
        reconnectEdge(oldEdge, newConnection, els).map((edge) => ({
          ...edge,
          // Preserve existing marker or assign a default
          type: edge.type,
          markerEnd: edge.markerEnd,
        }))
      ),
    []
  )
  return { onReconnect }
}

