import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  DefaultEdgeOptions,
  type NodeTypes,
  MarkerType,
  ConnectionLineType,
  ConnectionMode,
} from "@xyflow/react"

import "@xyflow/react/dist/style.css"
import { MAX_SCALE_TO_ZOOM_IN, MIN_SCALE_TO_ZOOM_OUT } from "./contants"
import { defaultEdges, defaultNodes } from "./initialElements"
import "@/styles/app.css"
import { Class, Package } from "./nodes"

const nodeTypes: NodeTypes = {
  package: Package,
  class: Class,
}

const defaultEdgeOptions: DefaultEdgeOptions = {
  type: "smoothstep",
  markerEnd: { type: MarkerType.ArrowClosed },
  style: { strokeWidth: 2 },
}

// interface AppProps {
//   onReactFlowInit: (instance: ReactFlowInstance) => void
// }

function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        defaultNodes={defaultNodes}
        defaultEdges={defaultEdges}
        connectionLineType={ConnectionLineType.SmoothStep}
        connectionMode={ConnectionMode.Loose}
        fitView
        minZoom={MIN_SCALE_TO_ZOOM_OUT}
        maxZoom={MAX_SCALE_TO_ZOOM_IN}
        fitViewOptions={{ maxZoom: 1, minZoom: 1 }}
      >
        <Background variant={BackgroundVariant.Lines} />
        <MiniMap zoomable pannable />
        <Controls />
      </ReactFlow>
    </div>
  )
}

export function AppWithProvider() {
  return (
    <ReactFlowProvider>
      <App />
    </ReactFlowProvider>
  )
}
