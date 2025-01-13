import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ConnectionLineType,
  ConnectionMode,
  ReactFlowInstance,
  useNodesState,
  addEdge,
  reconnectEdge,
  useEdgesState,
  Edge,
  Connection,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { MAX_SCALE_TO_ZOOM_IN, MIN_SCALE_TO_ZOOM_OUT } from "./contants"
import "@/styles/app.css"
import { Sidebar } from "@/components"
import { useCallback} from "react"
import { diagramNodeTypes } from "./nodes"
import { useDragDrop } from "./hooks"
import { diagramEdgeTypes } from "./edges/types";
import { SvgMarkers } from "./components/svgs/edges/markers"
import { create } from 'zustand';
import { type XYPosition } from '@xyflow/react';
import { initialEdges, initialNodes } from "./initialElements"


interface AppProps {
  onReactFlowInit: (instance: ReactFlowInstance) => void
}
function App({ onReactFlowInit }: AppProps) {
  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  
  const { onDrop, onDragOver } = useDragDrop()
  interface AppState {
    connectionLinePath: XYPosition[];
    setConnectionLinePath: (connectionLinePath: XYPosition[]) => void;
  }
  
  const useAppStore = create<AppState>((set) => ({
    connectionLinePath: [],
    setConnectionLinePath: (connectionLinePath: XYPosition[]) => {
      set({ connectionLinePath });
    },
  }));
  const onReconnect = useCallback(
    (oldEdge: Edge, newConnection: Connection) =>
      setEdges((els) => reconnectEdge(oldEdge, newConnection, els).map(edge => ({
        ...edge,
        // Preserve existing marker or assign a default
        type: edge.type,
        markerEnd: edge.markerEnd
      }))),
    []
  );
  type ControlPointData = XYPosition & {
    id: string;
    active?: boolean;
    prev?: string;
  };
  const onConnect = useCallback(
    (connection: Connection) => {
      const { connectionLinePath } = useAppStore.getState();
      const edge: Edge = {
        ...connection,
        id: `${Date.now()}-${connection.source}-${connection.target}`,
        type: 'biassociation',
        selected: true,
        data: {
          points: connectionLinePath.map(
            (point, i) =>
              ({
                ...point,
                id: window.crypto.randomUUID(),
                prev: i === 0 ? undefined : connectionLinePath[i - 1],
                active: true,
              } as ControlPointData)
          ),
        },
      };
      setEdges((edges) => addEdge(edge, edges));
    },
    [setEdges]
  );

  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh" }}>
      <Sidebar />
      <SvgMarkers />
      <ReactFlow
        id="react-flow-library"
        nodeTypes={diagramNodeTypes}
        edgeTypes={diagramEdgeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onReconnect={onReconnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        connectionLineType={ConnectionLineType.Step}
        connectionMode={ConnectionMode.Loose}
        fitView
        onInit={(instance) => onReactFlowInit(instance)}
        minZoom={MIN_SCALE_TO_ZOOM_OUT}
        maxZoom={MAX_SCALE_TO_ZOOM_IN}
      >
        <Background variant={BackgroundVariant.Lines} />
        <MiniMap zoomable pannable />
        <Controls orientation="horizontal" />
      </ReactFlow>
    </div>
  )
}
export function AppWithProvider({ onReactFlowInit }: AppProps) {
  return (
    <ReactFlowProvider>
      <App onReactFlowInit={onReactFlowInit} />
    </ReactFlowProvider>
  )
}
