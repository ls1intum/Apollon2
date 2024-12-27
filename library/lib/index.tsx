import ReactDOM from "react-dom/client"
import { AppWithProvider } from "./App"
import { ReactFlowInstance, type Node, type Edge } from "@xyflow/react"

export { type Node } from "@xyflow/react"

export class Apollon2 {
  private root: ReactDOM.Root | null = null
  private reactFlowInstance: ReactFlowInstance<Node, Edge> | null = null

  constructor(element: HTMLElement) {
    this.root = ReactDOM.createRoot(element)
    this.root.render(<AppWithProvider />)
  }

  public getNodes(): Node[] {
    if (this.reactFlowInstance) {
      return this.reactFlowInstance?.getNodes()
    }
    return []
  }

  public dispose() {
    if (this.root) {
      this.root.unmount()
      this.root = null
    }
  }
}
