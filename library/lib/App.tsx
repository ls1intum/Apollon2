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
import {
  HALF_OF_BACKGROUND_BOX_LENGHT_IN_PX,
  MAX_SCALE_TO_ZOOM_IN,
  MIN_SCALE_TO_ZOOM_OUT,
} from "./constants"
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
import { DiagramType } from "./types"

interface AppProps {
  onReactFlowInit: (instance: ReactFlowInstance) => void
  diagramType: DiagramType
}

const proOptions = { hideAttribution: true }

function App({ onReactFlowInit, diagramType }: AppProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, , onEdgesChange] = useEdgesState(initialEdges)
  const { onDrop } = useDrop(diagramType)
  const { onDragOver } = useDragOver()
  const { onNodeDragStop } = useNodeDragStop(setNodes)
  const { onConnect } = useConnect()
  const { onReconnect } = useReconnect()
  return (
    <div style={{ display: "flex", width: "100%", height: "100%" }}>
      <Sidebar selectedDiagramType={diagramType} />
      <SvgMarkers />
      <ReactFlow
        proOptions={proOptions}
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
          instance.zoomTo(1)
          onReactFlowInit(instance)
        }}
        minZoom={MIN_SCALE_TO_ZOOM_OUT}
        maxZoom={MAX_SCALE_TO_ZOOM_IN}
        snapToGrid
        snapGrid={[
          HALF_OF_BACKGROUND_BOX_LENGHT_IN_PX,
          HALF_OF_BACKGROUND_BOX_LENGHT_IN_PX,
        ]}
      >
        <Background variant={BackgroundVariant.Lines} />
        <MiniMap zoomable pannable />
        <Controls orientation="horizontal" />
      </ReactFlow>
    </div>
  )
}

export function AppWithProvider({ onReactFlowInit, diagramType }: AppProps) {
  return (
    <ReactFlowProvider>
      <App onReactFlowInit={onReactFlowInit} diagramType={diagramType} />
    </ReactFlowProvider>
  )
}
