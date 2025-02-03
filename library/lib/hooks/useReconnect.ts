// import { reconnectEdge, Edge, Connection, useReactFlow } from "@xyflow/react"
// import { useCallback } from "react"

// export const useReconnect = () => {
//   const { setEdges } = useReactFlow()
//   const onReconnect = useCallback(
//     (oldEdge: Edge, newConnection: Connection) =>
//       setEdges((els) =>
//         reconnectEdge(oldEdge, newConnection, els).map((edge) => ({
//           ...edge,
//           // Preserve existing marker or assign a default
//           type: edge.type,
//           markerEnd: edge.markerEnd,
          
//         }))
//       ),
//     []
//   )
//   return { onReconnect }
// }
import { reconnectEdge, Edge, Connection, useReactFlow } from "@xyflow/react";
import { useCallback } from "react";

export const useReconnect = () => {
  const { setEdges } = useReactFlow();

  const onReconnect = useCallback(
    (oldEdge: Edge, newConnection: Connection) =>
      setEdges((els) =>
        reconnectEdge(oldEdge, newConnection, els).map((edge) => ({
          ...edge,
          // Preserve the type and markerEnd values (if needed)
          type: edge.type,
          markerEnd: edge.markerEnd,
          // Explicitly override specific data properties using optional chaining and fallback values:
          data: {
            ...edge.data,
            sourceRole: oldEdge.data?.sourceRole ?? edge.data?.sourceRole ?? "",
            sourceMultiplicity:
              oldEdge.data?.sourceMultiplicity ??
              edge.data?.sourceMultiplicity ??
              "",
            targetRole: oldEdge.data?.targetRole ?? edge.data?.targetRole ?? "",
            targetMultiplicity:
              oldEdge.data?.targetMultiplicity ??
              edge.data?.targetMultiplicity ??
              "",
          },
        }))
      ),
    [setEdges]
  );

  return { onReconnect };
};
