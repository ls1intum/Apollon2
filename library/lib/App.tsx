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
import "@/styles/app.css"
import { Sidebar } from "@/components"

import { diagramEdgeTypes } from "./edges/types"
import { SvgMarkers } from "./components/svgs/edges/markers"
import { initialEdges, initialNodes } from "./initialElements"
import { useConnect, useReconnect, useDragDrop, useNodeDragStop } from "./hooks"

import { diagramNodeTypes } from "./nodes"

interface AppProps {
  onReactFlowInit: (instance: ReactFlowInstance) => void
}
function App({ onReactFlowInit }: AppProps) {
  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, , onEdgesChange] = useEdgesState(initialEdges)
  const { onDrop, onDragOver } = useDragDrop()
  const { onConnect } = useConnect()
  const { onReconnect } = useReconnect()
  const { onNodeDragStop } = useNodeDragStop()

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
        onNodeDragStop={onNodeDragStop}
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
