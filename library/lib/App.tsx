import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  ConnectionLineType,
  ConnectionMode,
  ReactFlowInstance,
} from "@xyflow/react"
import {
  MAX_SCALE_TO_ZOOM_IN,
  MIN_SCALE_TO_ZOOM_OUT,
  SNAP_TO_GRID_PX,
} from "./constants"
import {
  Cursors,
  Sidebar,
  SvgMarkers,
  CollapsableMiniMap,
  ExtendedControls,
} from "@/components"
import { diagramNodeTypes } from "./nodes"
import { useConnect, useReconnect, useNodeDragStop } from "./hooks"
import { diagramEdgeTypes } from "./edges"
import "@/styles/app.css"
import { DiagramType } from "./types"
import { useCursorStateSynced } from "./sync"
import { useBoundStore } from "./store"
import { useDragOver } from "./hooks/useDragOver"
import { useShallow } from "zustand/shallow"

interface AppProps {
  onReactFlowInit: (instance: ReactFlowInstance) => void
  diagramType: DiagramType
}

const proOptions = { hideAttribution: true }

function App({ onReactFlowInit, diagramType }: AppProps) {
  const { nodes, onNodesChange, edges, onEdgesChange } = useBoundStore(
    useShallow((state) => state)
  )

  const { onNodeDragStop } = useNodeDragStop()
  const { onDragOver } = useDragOver()
  const [cursors, onMouseMove] = useCursorStateSynced()
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
        onDragOver={onDragOver}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        onReconnect={onReconnect}
        connectionLineType={ConnectionLineType.Step}
        connectionMode={ConnectionMode.Loose}
        onPointerMove={onMouseMove}
        onInit={(instance) => {
          if (instance.getNodes().length > 0) {
            instance.fitView()
          }
          onReactFlowInit(instance)
        }}
        minZoom={MIN_SCALE_TO_ZOOM_OUT}
        maxZoom={MAX_SCALE_TO_ZOOM_IN}
        snapToGrid
        snapGrid={[SNAP_TO_GRID_PX / 2, SNAP_TO_GRID_PX / 2]}
      >
        <Cursors cursors={cursors} />
        <Background variant={BackgroundVariant.Lines} />
        <CollapsableMiniMap />
        <ExtendedControls />
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
