import { addEdge, Edge, Connection, useReactFlow } from "@xyflow/react"
import { useCallback } from "react"

// export const useConnect = () => {
//   const { setEdges } = useReactFlow()
//   const onConnect = useCallback(
//     (connection: Connection) => {
//       const edge: Edge = {
//         ...connection,
//         id: `${Date.now()}-${connection.source}-${connection.target}`,
//         type: "biassociation",
//         selected: true,
//       }
//       setEdges((edges) => addEdge(edge, edges))
//     },
//     [setEdges]
//   )
//   return { onConnect }
// }

export const useConnect = () => {
  const { setEdges } = useReactFlow();
  
  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdge: Edge = {
        ...connection,
        id: `${Date.now()}-${connection.source}-${connection.target}`,
        type: "biassociation", // Ensure this type matches your custom edge in diagramEdgeTypes
        selected: true,
        data: {
          edgeType: "aggregation", // Default edge type value
          sourceRole: "",          // Default empty string for source role
          sourceMultiplicity: "",  // Default empty string for source multiplicity
          targetRole: "",          // Default empty string for target role
          targetMultiplicity: "",  // Default empty string for target multiplicity
        },
      };
      setEdges((edges) => addEdge(newEdge, edges));
    },
    [setEdges]
  );
  
  return { onConnect };
};