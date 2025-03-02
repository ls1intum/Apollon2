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
} from "@xyflow/react"
import {
  HALF_OF_BACKGROUND_BOX_LENGHT_IN_PX,
  MAX_SCALE_TO_ZOOM_IN,
  MIN_SCALE_TO_ZOOM_OUT,
} from "./constants"

import { Cursors, Sidebar, SvgMarkers } from "@/components"
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
import {
  useCursorStateSynced,
  useEdgesStateSynced,
  useNodesStateSynced,
} from "./sync"

interface AppProps {
  onReactFlowInit: (instance: ReactFlowInstance) => void
  diagramType: DiagramType
}

const proOptions = { hideAttribution: true }

function App({ onReactFlowInit, diagramType }: AppProps) {
  // const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  // const [edges, , onEdgesChange] = useEdgesState(initialEdges)
  const [nodes, setNodes, onNodesChange] = useNodesStateSynced()
  const [edges, setEdges, onEdgesChange] = useEdgesStateSynced()
  const [cursors, onMouseMove] = useCursorStateSynced()

  const { onDrop } = useDrop(diagramType, nodes, setNodes)
  const { onDragOver } = useDragOver()
  const { onNodeDragStop } = useNodeDragStop(nodes, setNodes)
  const { onConnect } = useConnect(setEdges)
  const { onReconnect } = useReconnect(setEdges)

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
        onPointerMove={onMouseMove}
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
        <Cursors cursors={cursors} />
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
