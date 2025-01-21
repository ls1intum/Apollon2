import ReactDOM from "react-dom/client"
import { AppWithProvider } from "./App"
import { ReactFlowInstance, type Node, type Edge } from "@xyflow/react"
export { type Node } from "@xyflow/react"

export class Apollon2 {
  private root: ReactDOM.Root | null = null
  private reactFlowInstance: ReactFlowInstance<Node, Edge> | null = null

  constructor(element: HTMLElement) {
    this.root = ReactDOM.createRoot(element)
    this.root.render(
      <AppWithProvider onReactFlowInit={this.setReactFlowInstance.bind(this)} />
    )
  }

  private setReactFlowInstance(instance: ReactFlowInstance) {
    this.reactFlowInstance = instance
  }

  public getNodes(): Node[] {
    if (this.reactFlowInstance) {
      return this.reactFlowInstance.getNodes()
    }
    return []
  }

  public exportAsJson(diagramName: string) {
    if (this.reactFlowInstance) {
      const data = {
        version: "apollon2",
        title: diagramName,
        nodes: this.reactFlowInstance.getNodes(),
        edges: this.reactFlowInstance.getEdges(),
      }
      const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
        JSON.stringify(data)
      )}`
      const link = document.createElement("a")
      link.href = jsonString
      link.download = `${diagramName}.json`

      link.click()
    }
    return []
  }

  public getEdges(): Edge[] {
    if (this.reactFlowInstance) {
      return this.reactFlowInstance.getEdges()
    }
    return []
  }

  public resetDiagram() {
    if (this.reactFlowInstance) {
      this.reactFlowInstance.setEdges([])
      this.reactFlowInstance.setNodes([])
    }
  }

  public dispose() {
    if (this.root) {
      this.root.unmount()
      this.root = null
    }
  }
}
