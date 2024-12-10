import { useCallback, MouseEvent } from 'react';
import { Node } from '@xyflow/react';

interface UseNodeDragOptions {
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  getIntersectingNodes: (node: Node) => Node[];
}

export function useNodeDrag({
  nodes,
  setNodes,
  getIntersectingNodes,
}: UseNodeDragOptions) {
  return useCallback(
    (_: MouseEvent, node: Node) => {
      if (node.type !== 'class' && !node.parentId) {
        return;
      }

      const intersections = getIntersectingNodes(node).filter(
        (n) => n.type === 'package',
      );
      const groupClassName =
        intersections.length && node.parentId !== intersections[0]?.id
          ? 'active'
          : '';

      const newNodes = nodes.map((n) => {
        if (n.type === 'package' && n.id === node.parentId) {
          return {
            ...n,
            className: groupClassName,
          };
        } else if (n.id === node.id) {
          return {
            ...n,
            position: node.position,
          };
        }

        return { ...n };
      });

      setNodes(newNodes);
    },
    [getIntersectingNodes, nodes, setNodes],
  );
}
