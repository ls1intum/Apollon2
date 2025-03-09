import { Edge, Connection } from "@xyflow/react"
import { useCallback } from "react"
import { generateUUID } from "@/utils"
import useDiagramStore from "@/store/diagramStore"

export const useConnect = () => {
  const addEdge = useDiagramStore((state) => state.addEdge)

  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdge: Edge = {
        ...connection,
        id: generateUUID(),
        type: "ClassBidirectional", // Ensure this type matches your custom edge in diagramEdgeTypes
        selected: true,
      }
      addEdge(newEdge)
    },
    [addEdge]
  )

  return { onConnect }
}
