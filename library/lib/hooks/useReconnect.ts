import { useCallback } from "react"

import { useReactFlow, Edge, Connection } from "@xyflow/react"

export const useReconnect = () => {
  const { deleteElements, addEdges } = useReactFlow()

  const onReconnect = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      deleteElements({ edges: [oldEdge] })

      // Create a new edge with the same ID but updated properties
      const newEdge = {
        ...oldEdge,
        source: newConnection.source,
        target: newConnection.target,
        sourceHandle: newConnection.sourceHandle || oldEdge.sourceHandle,
        targetHandle: newConnection.targetHandle || oldEdge.targetHandle,
      }

      // Add the new edge to the graph
      addEdges([newEdge])
    },
    [deleteElements, addEdges]
  )

  return { onReconnect }
}
