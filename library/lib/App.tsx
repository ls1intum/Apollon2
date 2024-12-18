import {
  ReactFlow,
  ReactFlowInstance,
  ReactFlowProvider,
  type Node,
  type Edge,
} from "@xyflow/react"

import "@xyflow/react/dist/style.css"

const initialNodes: Node[] = [
  { id: "1", position: { x: 0, y: 0 }, data: { label: "1" } },
  { id: "2", position: { x: 0, y: 100 }, data: { label: "2" } },
]
const initialEdges: Edge[] = [{ id: "e1-2", source: "1", target: "2" }]

interface AppProps {
  onReactFlowInit: (instance: ReactFlowInstance) => void
}

export function App({ onReactFlowInit }: AppProps) {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={initialNodes}
        edges={initialEdges}
        onInit={onReactFlowInit}
      />
    </div>
  )
}

export function AppWithProvider({
  onReactFlowInit,
}: {
  onReactFlowInit: (instance: ReactFlowInstance) => void
}) {
  return (
    <ReactFlowProvider>
      <App onReactFlowInit={onReactFlowInit} />
    </ReactFlowProvider>
  )
}
