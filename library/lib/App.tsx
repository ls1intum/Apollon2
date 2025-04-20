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
import { useDiagramStore } from "./store"
import { useShallow } from "zustand/shallow"
import { DiagramType } from "./types"
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
} from "./hooks"
import { useDragOver } from "./hooks/useDragOver"
import { diagramNodeTypes } from "./nodes"

interface AppProps {
  onReactFlowInit: (instance: ReactFlowInstance) => void
  readonlyDiagram: boolean
}
const proOptions = { hideAttribution: true }

function App({ onReactFlowInit, readonlyDiagram }: AppProps) {
  // const { textEditor, updateEditor } = useDiagramStore()(
  //   useShallow((state) => ({
  //     textEditor: state.textEditor,
  //     updateEditor: state.updateEditor,
  //   }))
  // )
  const { nodes, onNodesChange, edges, onEdgesChange } = useDiagramStore()(
    useShallow((state) => ({
      nodes: state.nodes,
      onNodesChange: state.onNodesChange,
      edges: state.edges,
      onEdgesChange: state.onEdgesChange,
      setInteractiveElementId: state.setInteractiveElementId,
    }))
  )

  // const diagramType = useMetadataStore()(
  //   useShallow((state) => state.diagramType)
  // )
  const { onNodeDragStop } = useNodeDragStop()
  const { onDragOver } = useDragOver()
  // const [cursors, onMouseMove] = useCursorStateSynced()
  const { onConnect, onConnectEnd, onConnectStart, onEdgesDelete } =
    useConnect()
  const { onReconnect } = useReconnect()
  const { onNodeClick, onEdgeClick, onPaneClick } = useCanvasClickEvents()

  return (
    <div style={{ display: "flex", width: "100%", height: "100%" }}>
      <Sidebar selectedDiagramType={DiagramType.ClassDiagram} />

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
        <CustomBackground />
        <CustomMiniMap />
        <CustomControls />
      </ReactFlow>

      {/* <div
        style={{
          width: "100%",
          height: "100%",
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "10px",
        }}
      >
        <Button
          onClick={() => {
            updateEditor(generateUUID(), "test")
          }}
        >
          Add
        </Button>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "10px",
          }}
        >
          {textEditor.map((elem) => (
            <textarea
              key={elem.id}
              value={elem.name}
              onChange={(e) => {
                updateEditor(elem.id, e.target.value)
              }}
              placeholder="Collaborative text area"
              style={{
                width: "100%",
                height: "20px",
                backgroundColor: "GrayText",
              }}
            />
          ))}
        </div>

        <div>
          {textEditor.map((elem) => (
            <div key={elem.id}>{elem.name}</div>
          ))}
        </div>
      </div> */}
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
