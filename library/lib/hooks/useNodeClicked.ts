import { useCallback } from 'react';
import { Node, NodeMouseHandler } from '@xyflow/react';

interface UseNodeClickOptions {
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
}

export function useNodeClick({
  setNodes,
}: UseNodeClickOptions): NodeMouseHandler {
  return useCallback(
    (_, clicked) => {
      // Add 'blink' class to the clicked node
      setNodes((prev) =>
        prev.map((node) =>
          node.id === clicked.id ? { ...node, className: 'blink' } : node,
        ),
      );

      // Remove the 'blink' class after 3 seconds
      window.setTimeout(() => {
        setNodes((prev) =>
          prev.map((node) =>
            node.id === clicked.id ? { ...node, className: undefined } : node,
          ),
        );
      }, 3000);
    },
    [setNodes],
  );
}
