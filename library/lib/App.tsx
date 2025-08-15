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
import "@xyflow/react/dist/style.css"
import "@/styles/app.css"
import { useDiagramStore, useMetadataStore } from "./store/context"
import { useShallow } from "zustand/shallow"
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
  useElementInteractions,
} from "./hooks"
import { useDragOver } from "./hooks/useDragOver"
import { diagramNodeTypes } from "./nodes"
import { useDiagramModifiable } from "./hooks/useDiagramModifiable"
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts"
import { ApollonMode } from "./typings"

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

  const diagramMode = useMetadataStore(useShallow((state) => state.mode))
  const isDiagramModifiable = useDiagramModifiable()

  const onNodeDragStop = useNodeDragStop()
  const onDragOver = useDragOver()
  const { onConnect, onConnectEnd, onConnectStart, onEdgesDelete } =
    useConnect()
  const onReconnect = useReconnect()
  const { onBeforeDelete, onNodeDoubleClick, onEdgeDoubleClick } =
    useElementInteractions()

  useKeyboardShortcuts()

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
        overflow: "hidden",
      }}
    >
      {diagramMode === ApollonMode.Modelling && <Sidebar />}

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
          instance.fitView({ maxZoom: 1.0, minZoom: 1.0 })
          onReactFlowInit(instance)
        }}
        minZoom={MIN_SCALE_TO_ZOOM_OUT}
        maxZoom={MAX_SCALE_TO_ZOOM_IN}
        snapToGrid
        snapGrid={[SNAP_TO_GRID_PX, SNAP_TO_GRID_PX]}
        onNodeDoubleClick={onNodeDoubleClick}
        onEdgeDoubleClick={onEdgeDoubleClick}
        onBeforeDelete={onBeforeDelete}
        proOptions={proOptions}
        edgesReconnectable={isDiagramModifiable}
        nodesConnectable={isDiagramModifiable}
        nodesDraggable={isDiagramModifiable}
        style={{ width: "100%", height: "100%" }}
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
