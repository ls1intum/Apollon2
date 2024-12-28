import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  DefaultEdgeOptions,
  MarkerType,
  ConnectionLineType,
  ConnectionMode,
  ReactFlowInstance,
} from "@xyflow/react"

import "@xyflow/react/dist/style.css"
import { MAX_SCALE_TO_ZOOM_IN, MIN_SCALE_TO_ZOOM_OUT } from "./contants"
import { defaultEdges, defaultNodes } from "./initialElements"
import "@/styles/app.css"
import { nodeTypes } from "./nodes/types"
import { Sidebar } from "./components"

const defaultEdgeOptions: DefaultEdgeOptions = {
  type: "smoothstep",
  markerEnd: { type: MarkerType.ArrowClosed },
  style: { strokeWidth: 2 },
}

interface AppProps {
  onReactFlowInit: (instance: ReactFlowInstance) => void
}

function App({ onReactFlowInit }: AppProps) {
  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh" }}>
      <div
        style={{
          // width: "120px", // Fixed width for sidebar
          height: "100%", // Full height
          backgroundColor: "#f0f0f0", // Example background color
          overflowY: "auto", // Scrollable if content overflows
          borderRight: "1px solid #ccc", // Optional border for separation
          padding: "10px", // Optional padding for content
        }}
      >
        <Sidebar />
      </div>
      <ReactFlow
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        defaultNodes={defaultNodes}
        defaultEdges={defaultEdges}
        connectionLineType={ConnectionLineType.SmoothStep}
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
