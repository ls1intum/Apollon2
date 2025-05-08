import {
  ReactFlowProvider,
  ReactFlowInstance,
  ConnectionLineType,
  ConnectionMode,
  ReactFlow,
} from "@xyflow/react"
import {
  CustomBackground,
  CustomControls,
  CustomMiniMap,
  Sidebar,
  SvgMarkers,
} from "@/components"
import "@/styles/app.css"
import { useDiagramStore, useMetadataStore } from "./store/context"
import { useShallow } from "zustand/shallow"
import { ApollonMode, DiagramType } from "./types"
import {
  MIN_SCALE_TO_ZOOM_OUT,
  MAX_SCALE_TO_ZOOM_IN,
  SNAP_TO_GRID_PX,
} from "./constants"
import { diagramEdgeTypes } from "./edges"
import {
  useNodeDragStop,
  useConnect,
  useReconnect,
  useCanvasClickEvents,
  useElementInteractions,
} from "./hooks"
import { useDragOver } from "./hooks/useDragOver"
import { diagramNodeTypes } from "./nodes"
import { useDiagramModifiable } from "./hooks/useDiagramModifiable"

interface AppProps {
  onReactFlowInit: (instance: ReactFlowInstance) => void
}
const proOptions = { hideAttribution: true }

function App({ onReactFlowInit }: AppProps) {
  const { nodes, onNodesChange, edges, onEdgesChange, diagramId } =
    useDiagramStore(
      useShallow((state) => ({
        nodes: state.nodes,
        onNodesChange: state.onNodesChange,
        edges: state.edges,
        onEdgesChange: state.onEdgesChange,
        diagramId: state.diagramId,
      }))
    )
  const { diagramMode } = useMetadataStore(
    useShallow((state) => ({
      readonlyDiagram: state.readonly,
      diagramMode: state.mode,
    }))
  )

  const { onNodeDragStop } = useNodeDragStop()
  const { onDragOver } = useDragOver()
  const { onConnect, onConnectEnd, onConnectStart, onEdgesDelete } =
    useConnect()
  const { onReconnect } = useReconnect()
  const { onNodeClick, onEdgeClick, onPaneClick } = useCanvasClickEvents()
  const { onBeforeDelete, onNodeDoubleClick } = useElementInteractions()

  const isDiagramModifiable = useDiagramModifiable()

  return (
    <div
      style={{
        display: "flex",
        flexGrow: 1,
      }}
    >
      {diagramMode === ApollonMode.Modelling && (
        <Sidebar selectedDiagramType={DiagramType.ClassDiagram} />
      )}
      <SvgMarkers />
      <ReactFlow
        id={`react-flow-library-${diagramId}`}
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
        zoomOnDoubleClick={false}
        onNodeDragStop={onNodeDragStop}
        onReconnect={onReconnect}
        connectionLineType={ConnectionLineType.Step}
        connectionMode={ConnectionMode.Loose}
        onInit={(instance) => {
          onReactFlowInit(instance)
        }}
        minZoom={MIN_SCALE_TO_ZOOM_OUT}
        maxZoom={MAX_SCALE_TO_ZOOM_IN}
        snapToGrid
        snapGrid={[SNAP_TO_GRID_PX, SNAP_TO_GRID_PX]}
        nodesConnectable={isDiagramModifiable}
        nodesDraggable={isDiagramModifiable}
        elementsSelectable={isDiagramModifiable}
        edgesFocusable={isDiagramModifiable}
        nodesFocusable={isDiagramModifiable}
        onNodeClick={onNodeClick}
        onNodeDoubleClick={onNodeDoubleClick}
        onEdgeClick={onEdgeClick}
        edgesReconnectable={isDiagramModifiable}
        onPaneClick={onPaneClick}
        proOptions={proOptions}
        onBeforeDelete={onBeforeDelete}
      >
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
