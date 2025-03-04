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
import { useCursorStateSynced } from "./sync"
import useDiagramStore, { DiagramStoreData } from "./store/diagramStore"

interface AppProps {
  onReactFlowInit: (instance: ReactFlowInstance) => void
  diagramType: DiagramType
  subscribers: Set<(state: DiagramStoreData) => void>
}

const proOptions = { hideAttribution: true }

function App({ onReactFlowInit, diagramType }: AppProps) {
  const { nodes, onNodesChange, edges, onEdgesChange } = useDiagramStore()

  const [cursors, onMouseMove] = useCursorStateSynced()
  const { onDrop } = useDrop(diagramType, nodes)
  const { onDragOver } = useDragOver()
  const { onNodeDragStop } = useNodeDragStop()
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

export function AppWithProvider({
  onReactFlowInit,
  diagramType,
  subscribers,
}: AppProps) {
  subscribers.forEach((subscriber) =>
    useDiagramStore.subscribe((state) =>
      subscriber({ nodes: state.nodes, edges: state.edges })
    )
  )
  return (
    <ReactFlowProvider>
      <App
        onReactFlowInit={onReactFlowInit}
        diagramType={diagramType}
        subscribers={subscribers}
      />
    </ReactFlowProvider>
  )
}
