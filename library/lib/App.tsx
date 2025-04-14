import {
  ReactFlow,
  ReactFlowProvider,
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
  CustomMiniMap,
  CustomControls,
  CustomBackground,
} from "@/components"
import { diagramNodeTypes } from "./nodes"
import {
  useConnect,
  useReconnect,
  useNodeDragStop,
  useCanvasClickEvents,
} from "./hooks"
import { diagramEdgeTypes } from "./edges"
import "@/styles/app.css"
import { useCursorStateSynced } from "./sync"
import { useDiagramStore, useMetadataStore } from "./store"
import { useDragOver } from "./hooks/useDragOver"
import { useShallow } from "zustand/shallow"

interface AppProps {
  onReactFlowInit: (instance: ReactFlowInstance) => void
  readonlyDiagram: boolean
}

const proOptions = { hideAttribution: true }

function App({ onReactFlowInit, readonlyDiagram }: AppProps) {
  const { nodes, onNodesChange, edges, onEdgesChange } = useDiagramStore()(
    useShallow((state) => ({
      nodes: state.nodes,
      onNodesChange: state.onNodesChange,
      edges: state.edges,
      onEdgesChange: state.onEdgesChange,
      setInteractiveElementId: state.setInteractiveElementId,
    }))
  )

  const diagramType = useMetadataStore()(
    useShallow((state) => state.diagramType)
  )
  const { onNodeDragStop } = useNodeDragStop()
  const { onDragOver } = useDragOver()
  const [cursors, onMouseMove] = useCursorStateSynced()
  const { onConnect, onConnectEnd, onConnectStart, onEdgesDelete } =
    useConnect()
  const { onReconnect } = useReconnect()
  const { onNodeClick, onEdgeClick, onPaneClick } = useCanvasClickEvents()

  return (
    <div style={{ display: "flex", width: "100%", height: "100%" }}>
      <Sidebar selectedDiagramType={diagramType} />

      <SvgMarkers />
      <ReactFlow
        id="react-flow-library"
        nodeTypes={diagramNodeTypes}
        edgeTypes={diagramEdgeTypes}
        nodes={nodes}
        edges={edges}
        onDragOver={onDragOver}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnectStart={onConnectStart}
        onConnect={onConnect}
        onEdgesDelete={onEdgesDelete}
        onConnectEnd={onConnectEnd}
        onNodeDragStop={onNodeDragStop}
        onReconnect={onReconnect}
        connectionLineType={ConnectionLineType.Step}
        connectionMode={ConnectionMode.Loose}
        onPointerMove={onMouseMove}
        onInit={(instance) => {
          onReactFlowInit(instance)
        }}
        minZoom={MIN_SCALE_TO_ZOOM_OUT}
        maxZoom={MAX_SCALE_TO_ZOOM_IN}
        snapToGrid
        snapGrid={[SNAP_TO_GRID_PX, SNAP_TO_GRID_PX]}
        nodesDraggable={!readonlyDiagram}
        nodesConnectable={!readonlyDiagram}
        elementsSelectable={!readonlyDiagram}
        edgesFocusable={!readonlyDiagram}
        nodesFocusable={!readonlyDiagram}
        onNodeClick={onNodeClick}
        onNodeDrag={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        proOptions={proOptions}
      >
        <Cursors cursors={cursors} />
        <CustomBackground />
        <CustomMiniMap />
        <CustomControls />
      </ReactFlow>
    </div>
  )
}

export function AppWithProvider(props: AppProps) {
  return (
    <ReactFlowProvider>
      <App {...props} />
    </ReactFlowProvider>
  )
}
