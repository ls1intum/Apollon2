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
import { useEffect } from "react"

// Debug component - add this temporarily
const UndoRedoDebugger = () => {
  const { canUndo, canRedo, undo, redo, undoManager, addNode, nodes } = useDiagramStore(
    useShallow((state) => ({
      canUndo: state.canUndo,
      canRedo: state.canRedo,
      undo: state.undo,
      redo: state.redo,
      undoManager: state.undoManager,
      addNode: state.addNode,
      nodes: state.nodes,
    }))
  )

  const addTestNode = () => {
    const newNode = {
      id: `test-${Date.now()}`,
      type: 'default',
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: `Test Node ${nodes.length + 1}` },
    }
    console.log("➕ Adding test node:", newNode)
    addNode(newNode)
  }

  const testUndo = () => {
    console.log("🧪 Manual undo test")
    undo()
  }

  const testRedo = () => {
    console.log("🧪 Manual redo test")
    redo()
  }

  useEffect(() => {
    console.log("🔍 Debug state update:", {
      canUndo,
      canRedo,
      undoManager: !!undoManager,
      nodesCount: nodes.length,
      undoStackLength: undoManager?.undoStack.length || 0,
      redoStackLength: undoManager?.redoStack.length || 0,
    })
  }, [canUndo, canRedo, undoManager, nodes.length])

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'white', 
      padding: '10px', 
      border: '1px solid #ccc',
      borderRadius: '4px',
      zIndex: 1000,
      fontSize: '12px',
      minWidth: '200px'
    }}>
      <h4>🔧 Undo/Redo Debug Panel</h4>
      <div>Nodes: {nodes.length}</div>
      <div>Undo Manager: {undoManager ? '✅' : '❌'}</div>
      <div>Can Undo: {canUndo ? '✅' : '❌'}</div>
      <div>Can Redo: {canRedo ? '✅' : '❌'}</div>
      {undoManager && (
        <>
          <div>Undo Stack: {undoManager.undoStack.length}</div>
          <div>Redo Stack: {undoManager.redoStack.length}</div>
        </>
      )}
      <div style={{ marginTop: '10px', display: 'flex', gap: '5px', flexDirection: 'column' }}>
        <button onClick={addTestNode} style={{ fontSize: '11px', padding: '4px 8px' }}>
          ➕ Add Test Node
        </button>
        <button 
          onClick={testUndo} 
          disabled={!canUndo}
          style={{ 
            fontSize: '11px', 
            padding: '4px 8px',
            backgroundColor: canUndo ? '#fff' : '#f5f5f5',
            color: canUndo ? '#000' : '#999',
            cursor: canUndo ? 'pointer' : 'not-allowed'
          }}
        >
          ↶ Undo
        </button>
        <button 
          onClick={testRedo} 
          disabled={!canRedo}
          style={{ 
            fontSize: '11px', 
            padding: '4px 8px',
            backgroundColor: canRedo ? '#fff' : '#f5f5f5',
            color: canRedo ? '#000' : '#999',
            cursor: canRedo ? 'pointer' : 'not-allowed'
          }}
        >
          ↷ Redo
        </button>
      </div>
      <div style={{ marginTop: '8px', fontSize: '10px', color: '#666' }}>
        Try: Ctrl+Z, Ctrl+Y, Ctrl+Shift+Z<br/>
        (Check browser console for logs)
      </div>
    </div>
  )
}

interface AppProps {
  onReactFlowInit: (instance: ReactFlowInstance) => void
}
const proOptions = { hideAttribution: true }

function App({ onReactFlowInit }: AppProps) {
  const { nodes, onNodesChange, edges, onEdgesChange, diagramId, initializeUndoManager } =
    useDiagramStore(
      useShallow((state) => ({
        nodes: state.nodes,
        onNodesChange: state.onNodesChange,
        edges: state.edges,
        onEdgesChange: state.onEdgesChange,
        diagramId: state.diagramId,
        initializeUndoManager: state.initializeUndoManager,
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

  // Initialize undo manager when component mounts
  useEffect(() => {
    console.log("🚀 App component mounted, initializing undo manager...")
    initializeUndoManager()
  }, [initializeUndoManager])

  // Enable keyboard shortcuts for undo/redo
  useKeyboardShortcuts()

  return (
    <div style={{ display: "flex", flex: 1 }}>
      <UndoRedoDebugger />
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