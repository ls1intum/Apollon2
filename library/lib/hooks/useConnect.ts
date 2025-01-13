import {
    addEdge,
    Edge,
    Connection,
    useReactFlow
  } from "@xyflow/react"
import { useCallback} from "react"

export const useConnect = () => {

  const { setEdges} = useReactFlow()
  const onConnect = useCallback(
      (connection: Connection) => {
        const edge: Edge = {
          ...connection,
          id: `${Date.now()}-${connection.source}-${connection.target}`,
          type: "biassociation",
          selected: true,
        }
        setEdges((edges) => addEdge(edge, edges))
      },
      [setEdges]
    )
  return { onConnect }
}

