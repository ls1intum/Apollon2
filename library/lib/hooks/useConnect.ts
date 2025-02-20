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
        data: {
          sourceRole: "", // Default empty string for source role
          sourceMultiplicity: "", // Default empty string for source multiplicity
          targetRole: "", // Default empty string for target role
          targetMultiplicity: "", // Default empty string for target multiplicity
        },
      }
      setEdges((edges) => addEdge(newEdge, edges))
    },
    [setEdges]
  )

  return { onConnect }
}
