import { MouseEvent, DragEvent, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  Panel,
  useReactFlow,
  ReactFlowProvider,
  type Node,
  ConnectionLineType,
  OnConnect,
  addEdge,
  NodeMouseHandler,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import '@xyflow/react/dist/style.css';
import Sidebar from './components/Sidebar';
import { sortNodes, getId, getNodePositionInsideParent } from './utils';
import { nodeTypes } from './nodes/types';
import DevTools from './components/devtool/DevTools';
import useNodesStateSynced from './sync/useNodesStateSynced';
import useEdgesStateSynced from './sync/useEdgesStateSynced';
import useCursorStateSynced from './sync/useCursorStateSynced';
import Cursors from './components/Cursors';
import SelectedNodesToolbar from './components/SelectedNodesToolbar';

// const edgeTypes = {
//   editableEdgeComponent: EditableEdgeComponent,
// };

const onDragOver = (event: DragEvent) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
};

export function App() {
  const [nodes, setNodes, onNodesChange] = useNodesStateSynced();
  const [edges, setEdges, onEdgesChange] = useEdgesStateSynced();
  const [cursors, onMouseMove] = useCursorStateSynced();
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

    console.log('newNode', newNode);

    if (groupNode) {
      // if we drop a node on a group node, we want to position the node inside the group
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

    // we need to make sure that the parents are sorted before the children
    // to make sure that the children are rendered on top of the parents
    const sortedNodes = nodes.concat(newNode).sort(sortNodes);
    setNodes(sortedNodes);
  };

  const onNodeDragStop = useCallback(
    (_: MouseEvent, node: Node) => {
      if (node.type !== 'classDiagram' && !node.parentId) {
        return;
      }

      const intersections = getIntersectingNodes(node).filter(
        (n) => n.type === 'package',
      );
      const groupNode = intersections[0];

      // when there is an intersection on drag stop, we want to attach the node to its new parent
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

  const onNodeDrag = useCallback(
    (_: MouseEvent, node: Node) => {
      if (node.type !== 'classDiagram' && !node.parentId) {
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

  const onConnect: OnConnect = useCallback(
    (params) => {
      console.log('onConnect', params);
      setEdges((prev) => addEdge(params, prev));
    },
    [setEdges],
  );

  // We are adding a blink effect on click that we remove after 3000ms again.
  // This should help users to see that a node was clicked by another user.
  const onNodeClick: NodeMouseHandler = useCallback(
    (_, clicked) => {
      setNodes((prev) =>
        prev.map((node) =>
          node.id === clicked.id ? { ...node, className: 'blink' } : node,
        ),
      );

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

  return (
    <div
      className="wrapper"
      style={{
        display: 'flex',
        height: '100vh', // Full viewport height
        width: '100vw', // Full viewport width
      }}
    >
      <div
        style={{
          width: '120px', // Fixed width for sidebar
          height: '100%', // Full height
          backgroundColor: '#f0f0f0', // Example background color
          overflowY: 'auto', // Scrollable if content overflows
          borderRight: '1px solid #ccc', // Optional border for separation
        }}
      >
        <Sidebar />
      </div>
      <div
        className="react-flow-wrapper"
        style={{
          flexGrow: 1, // Take up remaining space
          height: '100%', // Full height
          width: '100%', // Full width within flex layout
          position: 'relative', // Ensure ReactFlow is positioned correctly
        }}
      >
        <ReactFlow
          nodes={nodes}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}

          edges={edges}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onEdgesChange={onEdgesChange}
          connectionLineType={ConnectionLineType.Step}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          fitView
          minZoom={0.6}
          maxZoom={2}
          onNodeDrag={onNodeDrag}
          onNodeDragStop={onNodeDragStop}
          onPointerMove={onMouseMove}
        >
          <Cursors cursors={cursors} />

          <Background variant={BackgroundVariant.Lines} />
          <MiniMap zoomable pannable />
          <Controls />
          <Panel position={'top-right'}>
            <div style={{ display: 'flex', alignContent: 'flex-end' }}>
              Export
              <br />
              import
            </div>
          </Panel>
          <DevTools />

          <SelectedNodesToolbar />
        </ReactFlow>
      </div>
    </div>
  );
}

export default function AppWithProvider() {
  return (
    <ReactFlowProvider>
      <App />
    </ReactFlowProvider>
  );
}
