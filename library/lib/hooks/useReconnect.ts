import { Edge, Connection } from "@xyflow/react"
import { useCallback } from "react"

export const useReconnect = (
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>
) => {
  const updateEdge = useCallback(
    (id: string, newProperties: Partial<Edge>) => {
      setEdges((edges) =>
        edges.map((edge) => {
          if (edge.id === id) {
            return {
              ...edge,
              ...newProperties,
            }
          }
          return edge
        })
      )
    },
    [setEdges]
  )

  const onReconnect = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      updateEdge(oldEdge.id, {
        source: newConnection.source,
        target: newConnection.target,
        sourceHandle: newConnection.sourceHandle,
        targetHandle: newConnection.targetHandle,
      })
    },
    [updateEdge]
  )

  return { onReconnect }
}
