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
  useEdgesState,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { MAX_SCALE_TO_ZOOM_IN, MIN_SCALE_TO_ZOOM_OUT } from "./contants"
import { initialEdges, initialNodes } from "./initialElements"
import { Sidebar, SvgMarkers } from "@/components"
import { diagramNodeTypes } from "./nodes"
import {
  useConnect,
  useDragOver,
  useDrop,
  useNodeDragStop,
  useReconnect,
} from "./hooks"
import { diagramEdgeTypes } from "./edges"
import "@/styles/app.css"

interface AppProps {
  onReactFlowInit: (instance: ReactFlowInstance) => void
  width: number | string
  height: number | string
}

function App({ onReactFlowInit, width, height }: AppProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, , onEdgesChange] = useEdgesState(initialEdges)
  const { onDrop } = useDrop()
  const { onDragOver } = useDragOver()
  const { onNodeDragStop } = useNodeDragStop(setNodes)
  const { onConnect } = useConnect()
  const { onReconnect } = useReconnect()
  console.log("width", width)
  console.log("height", height)

  return (
    <div style={{ display: "flex", width, height }}>
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
        onNodeDragStop={onNodeDragStop}
        connectionLineType={ConnectionLineType.Step}
        connectionMode={ConnectionMode.Loose}
        fitView
        onInit={(instance) => {
          instance.zoomTo(0.8)
          onReactFlowInit(instance)
        }}
        minZoom={MIN_SCALE_TO_ZOOM_OUT}
        maxZoom={MAX_SCALE_TO_ZOOM_IN}
      >
        <Background variant={BackgroundVariant.Lines} />
        <MiniMap zoomable pannable />
        <Controls orientation="horizontal" />
        {/* <ActionsPanel /> */}
      </ReactFlow>
    </div>
  )
}

export function AppWithProvider({ onReactFlowInit, width, height }: AppProps) {
  return (
    <ReactFlowProvider>
      <App onReactFlowInit={onReactFlowInit} width={width} height={height} />
    </ReactFlowProvider>
  )
}
