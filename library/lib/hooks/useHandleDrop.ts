import { DragEvent } from 'react';
import { useReactFlow, type Node } from '@xyflow/react';
import { getId, getNodePositionInsideParent, sortNodes } from '../utils';
import { nodeTypes } from '../nodes/types';

interface UseHandleDropProps {
  nodes: Node[];
  setNodes: (nodes: Node[] | ((prev: Node[]) => Node[])) => void;
}

export function useHandleDrop({ nodes, setNodes }: UseHandleDropProps) {
  const { screenToFlowPosition, getIntersectingNodes } = useReactFlow();

  const onDrop = (event: DragEvent) => {
    event.preventDefault();

    const type = event.dataTransfer.getData(
      'application/reactflow',
    ) as keyof typeof nodeTypes;
    const position = screenToFlowPosition({
      x: event.clientX - 20,
      y: event.clientY - 20,
    });

    const nodeDimensions =
      type === 'package' ? { width: 400, height: 200 } : {};

    const intersections = getIntersectingNodes({
      x: position.x,
      y: position.y,
      width: 40,
      height: 40,
    }).filter((n) => n.type === 'package');
    const groupNode = intersections[0];

    const newNode: Node = {
      id: getId(),
      type,
      position,
      data: { label: `${type}` },
      ...nodeDimensions,
    };

    if (groupNode) {
      // Position inside the group if dropped on a package node
      newNode.position = getNodePositionInsideParent(
        {
          position,
          width: 40,
          height: 40,
        },
        groupNode,
      ) ?? { x: 0, y: 0 };
      newNode.parentId = groupNode?.id;
      newNode.expandParent = true;
    }

    if (type === 'classDiagram') {
      newNode.data = {
        label: 'Class Diagram',
        methods: [],
        attributes: [],
        classDiagramType: 'abstract',
      };
    }

    // Ensure parents render before children
    const sortedNodes = nodes.concat(newNode).sort(sortNodes);
    setNodes(sortedNodes);
  };

  return onDrop;
}
