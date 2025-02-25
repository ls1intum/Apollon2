import { addEdge, Edge, Connection, useReactFlow } from "@xyflow/react"
import { useCallback } from "react"
import { generateUUID } from "@/utils"

export const useConnect = () => {
  const { setEdges } = useReactFlow()

  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdge: Edge = {
        ...connection,
        id: generateUUID(),
        type: "ClassBidirectional", // Ensure this type matches your custom edge in diagramEdgeTypes
        selected: true,
      }
      setEdges((edges) => addEdge(newEdge, edges))
    },
    [setEdges]
  )

  return { onConnect }
}
