import {
  ReactFlow,
  ReactFlowInstance,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  DefaultEdgeOptions,
  type NodeTypes,
  MarkerType,
  type Edge,
  ConnectionLineType,
  ConnectionMode,
} from "@xyflow/react"

import "@xyflow/react/dist/style.css"
import { MAX_SCALE_TO_ZOOM_IN, MIN_SCALE_TO_ZOOM_OUT } from "./contants"
import { DiagramElementNode } from "./nodes/DiagramElementNode"
import { DiagramElementNodeType } from "./nodes"
import { defaultEdges, defaultNodes } from "./initialElements"
import "@/styles/app.css"

const nodeTypes: NodeTypes = {
  diagramElementNode: DiagramElementNode,
}

const defaultEdgeOptions: DefaultEdgeOptions = {
  type: "smoothstep",
  markerEnd: { type: MarkerType.ArrowClosed },
  style: { strokeWidth: 2 },
}

interface AppProps {
  onReactFlowInit: (
    instance: ReactFlowInstance<DiagramElementNodeType, Edge>
  ) => void
}

function App({ onReactFlowInit }: AppProps) {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        defaultNodes={defaultNodes}
        defaultEdges={defaultEdges}
        onInit={onReactFlowInit}
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

export function AppWithProvider({ onReactFlowInit }: AppProps) {
  return (
    <ReactFlowProvider>
      <App onReactFlowInit={onReactFlowInit} />
    </ReactFlowProvider>
  )
}
