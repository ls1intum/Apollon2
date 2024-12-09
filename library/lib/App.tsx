import { DragEvent, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  Panel,
  useReactFlow,
  ReactFlowProvider,
  ConnectionLineType,
  OnConnect,
  addEdge,
  ReactFlowInstance,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import '@xyflow/react/dist/style.css';
import Sidebar from './components/Sidebar';
import { nodeTypes } from './nodes/types';
import DevTools from './components/devtool/DevTools';
import useNodesStateSynced from './sync/useNodesStateSynced';
import useEdgesStateSynced from './sync/useEdgesStateSynced';
import useCursorStateSynced from './sync/useCursorStateSynced';
import Cursors from './components/Cursors';
import SelectedNodesToolbar from './components/SelectedNodesToolbar';
import './app.module.css';
import {
  useHandleDrop,
  useNodeClick,
  useNodeDrag,
  useNodeDragStop,
} from './hooks';

// const edgeTypes = {
//   editableEdgeComponent: EditableEdgeComponent,
// };

const onDragOver = (event: DragEvent) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
};

export function App({
  onReactFlowInit,
}: {
  onReactFlowInit: (instance: ReactFlowInstance) => void;
}) {
  const [nodes, setNodes, onNodesChange] = useNodesStateSynced();
  const [edges, setEdges, onEdgesChange] = useEdgesStateSynced();
  const [cursors, onMouseMove] = useCursorStateSynced();
  const { getIntersectingNodes } = useReactFlow();
  const onDrop = useHandleDrop({ nodes, setNodes });
  const onNodeDragStop = useNodeDragStop({
    nodes,
    setNodes,
    getIntersectingNodes,
  });
  const onNodeDrag = useNodeDrag({ nodes, setNodes, getIntersectingNodes });
  const onNodeClick = useNodeClick({ setNodes });

  const onConnect: OnConnect = useCallback(
    (params) => {
      console.log('onConnect', params);
      setEdges((prev) => addEdge(params, prev));
    },
    [setEdges],
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
          onInit={onReactFlowInit}
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

export default function AppWithProvider({
  onReactFlowInit,
}: {
  onReactFlowInit: (instance: ReactFlowInstance) => void;
}) {
  return (
    <ReactFlowProvider>
      <App onReactFlowInit={onReactFlowInit} />
    </ReactFlowProvider>
  );
}
