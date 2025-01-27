import ReactDOM from "react-dom/client"
import { AppWithProvider } from "./App"
import { ReactFlowInstance, type Node, type Edge } from "@xyflow/react"
import {
  exportAsPNG,
  exportAsSVG,
  exportAsPDF,
  exportAsJSON,
  validateParsedJSON,
} from "./utils"

export class Apollon2 {
  private root: ReactDOM.Root | null = null
  private reactFlowInstance: ReactFlowInstance | null = null

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
    return this.reactFlowInstance ? this.reactFlowInstance.getNodes() : []
  }

  public getEdges(): Edge[] {
    return this.reactFlowInstance ? this.reactFlowInstance.getEdges() : []
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

  public exportAsJson(diagramName: string) {
    if (this.reactFlowInstance) {
      exportAsJSON(diagramName, this.reactFlowInstance)
    } else {
      console.error("ReactFlowInstance is not available for exporting JSON.")
    }
  }

  public exportImagePNG(
    diagramName: string,
    isBackgroundTransparent: boolean = false
  ) {
    if (this.reactFlowInstance) {
      exportAsPNG(diagramName, this.reactFlowInstance, isBackgroundTransparent)
    } else {
      console.error("ReactFlowInstance is not available for exporting PNG.")
    }
  }

  public exportImageAsSVG(diagramName: string) {
    if (this.reactFlowInstance) {
      exportAsSVG(diagramName, this.reactFlowInstance)
    } else {
      console.error("ReactFlowInstance is not available for exporting SVG.")
    }
  }

  public exportImageAsPDF(diagramName: string) {
    if (this.reactFlowInstance) {
      exportAsPDF(diagramName, this.reactFlowInstance)
    } else {
      console.error("ReactFlowInstance is not available for exporting PDF.")
    }
  }

  public async importJson(content: string): Promise<boolean | string> {
    if (this.reactFlowInstance) {
      const parsed = JSON.parse(content)

      // Validate the structure
      const result = validateParsedJSON(parsed)

      if (typeof result === "string") {
        return result
      }

      const { nodes, edges } = result

      this.reactFlowInstance.setNodes(nodes)
      this.reactFlowInstance.setEdges(edges)
      // We need to render the nodes and edges first before fitting the view
      requestAnimationFrame(() => {
        this.reactFlowInstance?.fitView()
      })
      return true
    } else {
      return "ReactFlowInstance is not available for importing JSON."
    }
  }
}
