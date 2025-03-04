import useDiagramStore from "@/store/diagramStore"
import { Edge, Connection } from "@xyflow/react"
import { useCallback } from "react"
import { useShallow } from "zustand/shallow"

export const useReconnect = () => {
  const { setEdges, edges } = useDiagramStore(
    useShallow((state) => ({ setEdges: state.setEdges, edges: state.edges }))
  )

  const updateEdge = useCallback(
    (id: string, newProperties: Partial<Edge>) => {
      setEdges(
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
