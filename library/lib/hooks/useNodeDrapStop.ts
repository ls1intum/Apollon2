import { useCallback, MouseEvent } from 'react';
import { Node } from '@xyflow/react';
import { sortNodes, getNodePositionInsideParent } from '../utils';

interface UseNodeDragStopOptions {
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  getIntersectingNodes: (node: Node) => Node[];
}

export function useNodeDragStop({
  nodes,
  setNodes,
  getIntersectingNodes,
}: UseNodeDragStopOptions) {
  return useCallback(
    (_: MouseEvent, node: Node) => {
      if (node.type !== 'classDiagram' && !node.parentId) {
        return;
      }

      const intersections = getIntersectingNodes(node).filter(
        (n) => n.type === 'package',
      );
      const groupNode = intersections[0];

      // when there is an intersection on drag stop, attach the node to its new parent
      if (intersections.length && node.parentId !== groupNode?.id) {
        const nextNodes: Node[] = nodes
          .map((n) => {
            if (n.id === groupNode.id) {
              return {
                ...n,
                className: '',
              };
            } else if (n.id === node.id) {
              const position = getNodePositionInsideParent(n, groupNode) ?? {
                x: 0,
                y: 0,
              };

              return {
                ...n,
                position,
                parentId: groupNode.id,
                extent: 'parent',
              } as Node;
            }

            return n;
          })
          .sort(sortNodes);

        setNodes(nextNodes);
      }
    },
    [getIntersectingNodes, nodes, setNodes],
  );
}
