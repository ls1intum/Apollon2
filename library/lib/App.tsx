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
  Node,
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



interface AppProps {
  onReactFlowInit: (instance: ReactFlowInstance) => void
}

const initialNodes: Node[] = [
  {
    id: "1",
    type: "package",
    position: { x: -100, y: 200 },
    width: 200,
    height: 200,
    selected: false,
    data: { name: "Package" },
  },
  {
    id: "2",
    type: "class",
    position: { x: 400, y: -100 },
    width: 296,
    height: 170,
    selected: false,
    data: {
      name: "Class",
      methods: [
        { id: "1", name: "method1" },
        { id: "2", name: "method2" },
      ],
      attributes: [
        { id: "1", name: "attribute1" },
        { id: "2", name: "attribute2" },
      ],
    },
  },
  {
    id: "3",
    type: "class",
    position: { x: 400, y: 100 },
    width: 296,
    height: 170,
    selected: false,
    data: {
      stereotype: "abstract",
      name: "AbstractClass",
      methods: [
        { id: "1", name: "method1" },
        { id: "2", name: "method2" },
      ],
      attributes: [
        { id: "1", name: "attribute1" },
        { id: "2", name: "attribute2" },
      ],
    },
  },
  {
    id: "4",
    type: "class",
    position: { x: 400, y: 300 },
    width: 296,
    height: 170,
    selected: false,
    data: {
      name: "InterfaceClass",
      stereotype: "interface",
      methods: [
        { id: "1", name: "method1" },
        { id: "2", name: "method2" },
      ],
      attributes: [
        { id: "1", name: "attribute1" },
        { id: "2", name: "attribute2" },
      ],
    },
  },
  {
    id: "5",
    type: "class",
    position: { x: 400, y: 500 },
    width: 296,
    height: 170,
    selected: false,
    data: {
      name: "EnumerationClass",
      stereotype: "enumaration",
      methods: [
        { id: "1", name: "method1" },
        { id: "2", name: "method2" },
      ],
      attributes: [
        { id: "1", name: "attribute1" },
        { id: "2", name: "attribute2" },
      ],
    },
  },
  {
    id: "6",
    type: "colorDescription",
    position: { x: -100, y: 600 },
    width: 160,
    height: 50,
    selected: false,
    data: {
      description: "Color description",
    },
  },

  // Testing TitleAndDescription
  // {
  //   id: "99",
  //   type: "titleAndDesctiption",
  //   position: { x: -100, y: 100 },
  //   width: 160,
  //   height: 200,
  //   selected: false,
  //   data: {
  //     title: "Title",
  //     description:
  //       "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  //   },
  // },
]

const initialEdges: Edge[] = [
  {
    id: "1->2",
    source: "1",
    target: "2",
    type: "uniassociation",

  },
  {
    id: "2->3",
    source: "2",
    target: "3",
    type: "realization",
  },
  {
    id: "3->4",
    source: "3",
    target: "4",
    type: "aggregation",

  },
  {
    id: "4->5",
    source: "4",
    target: "5",
    type: "composition",

  },
  {
    id: "5->1",
    source: "5",
    target: "1",
    type: "dependency",

  },


];
function App({ onReactFlowInit }: AppProps) {
  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  
  const { onDrop, onDragOver } = useDragDrop()
  // const onConnect = useCallback(
  //   (params: Connection) => setEdges((eds) => addEdge({ ...params }, eds)),
  //   []
  // );
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
      // We add a new edge based on the selected DEFAULT_ALGORITHM
      // and transfer all the control points from the connectionLinePath
      // in case the user has added any while creating the connection
      const edge: Edge = {
        ...connection,
        id: `${Date.now()}-${connection.source}-${connection.target}`,
        type: 'composition',
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
      {/* <svg style={{ position: 'absolute', top: 0, left: 0, width: 0, height: 0 }}>
      <defs>
        <marker
          id="diamond-marker"
          viewBox="0 0 30 30"
          markerWidth="30"
          markerHeight="30"
          refX="30"  // Aligns the endpoint of the line with the rightmost point of the diamond
          refY="15" 
          orient="auto"
          markerUnits="strokeWidth"
        >
        <path d="M0,15 L15,22 L30,15 L15,8 z" fill="black" stroke="currentColor" stroke-width="1.5" />
        </marker>
      </defs>
    </svg> */}
      <ReactFlow
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
