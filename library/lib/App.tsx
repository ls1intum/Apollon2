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
  useNodesState,
  addEdge,
  useEdgesState,
  Connection,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { MAX_SCALE_TO_ZOOM_IN, MIN_SCALE_TO_ZOOM_OUT } from "./contants"
import { initialEdges, initialNodes } from "./initialElements"
import "@/styles/app.css"
import { Sidebar } from "@/components"
import { useCallback } from "react"
import { diagramNodeTypes } from "./nodes"
import { useDragOver, useDrop, useNodeDragStop } from "./hooks"

const defaultEdgeOptions: DefaultEdgeOptions = {
  type: "step",
  markerEnd: { type: MarkerType.ArrowClosed },
  style: { strokeWidth: 2 },
}

interface AppProps {
  onReactFlowInit: (instance: ReactFlowInstance) => void
}

function App({ onReactFlowInit }: AppProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const { onDrop } = useDrop()
  const { onDragOver } = useDragOver()
  const { onNodeDragStop } = useNodeDragStop(setNodes)
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    []
  )

  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh" }}>
      <Sidebar />
      <ReactFlow
        id="react-flow-library"
        nodeTypes={diagramNodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onNodeDragStop={onNodeDragStop}
        connectionLineType={ConnectionLineType.SmoothStep}
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
