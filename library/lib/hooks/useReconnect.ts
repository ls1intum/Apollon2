import { reconnectEdge, Edge, Connection, useReactFlow } from "@xyflow/react"
import { useCallback } from "react"

export const useReconnect = () => {
  const { setEdges } = useReactFlow();

  const onReconnect = useCallback(
    (oldEdge: Edge, newConnection: Connection) =>
      setEdges((els) =>
        reconnectEdge(oldEdge, newConnection, els).map((edge) => {
          if (edge.id === oldEdge.id) {
            return {
              ...edge,
              // Preserve the type and markerEnd values
              type: edge.type,
              markerEnd: edge.markerEnd,
              // Update the data fields based on oldEdge values if present
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
            };
          }
          return edge;
        })
      ),
    [setEdges]
  );

  return { onReconnect };
};