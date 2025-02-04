
import { Edge, Connection, useReactFlow } from "@xyflow/react";
import { useCallback } from "react";

export const useReconnect = () => {
  const { updateEdge } = useReactFlow();

  const onReconnect = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      updateEdge(oldEdge.id, {
        source: newConnection.source,
        target: newConnection.target,
        sourceHandle: newConnection.sourceHandle,
        targetHandle: newConnection.targetHandle,
      
      });
    },
    [updateEdge]
  );

  return { onReconnect };
};
