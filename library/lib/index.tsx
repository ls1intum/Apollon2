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
import { DiagramType } from "./types"

export * from "./types"
export class Apollon2 {
  private root: ReactDOM.Root | null = null
  private reactFlowInstance: ReactFlowInstance | null = null
  private diagramType: DiagramType = DiagramType.ClassDiagram

  constructor(element: HTMLElement) {
    this.root = ReactDOM.createRoot(element)
    this.renderApp()
  }

  private renderApp() {
    if (this.root) {
      this.root.render(
        <AppWithProvider
          onReactFlowInit={this.setReactFlowInstance.bind(this)}
          diagramType={this.diagramType} // Pass the diagramType directly as a prop
        />
      )
    }
  }

  private setReactFlowInstance(instance: ReactFlowInstance) {
    this.reactFlowInstance = instance
  }

  private deSelectAllNodes = () => {
    if (this.reactFlowInstance) {
      this.reactFlowInstance.setNodes((nodes) =>
        nodes.map((node) => ({ ...node, selected: false }))
      )
    }
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
      this.deSelectAllNodes()
      exportAsJSON(diagramName, this.diagramType, this.reactFlowInstance)
    } else {
      console.error("ReactFlowInstance is not available for exporting JSON.")
    }
  }

  public exportImagePNG(
    diagramName: string,
    isBackgroundTransparent: boolean = false
  ) {
    if (this.reactFlowInstance) {
      this.deSelectAllNodes()
      exportAsPNG(diagramName, this.reactFlowInstance, isBackgroundTransparent)
    } else {
      console.error("ReactFlowInstance is not available for exporting PNG.")
    }
  }

  public exportImageAsSVG(diagramName: string) {
    if (this.reactFlowInstance) {
      this.deSelectAllNodes()
      exportAsSVG(diagramName, this.reactFlowInstance)
    } else {
      console.error("ReactFlowInstance is not available for exporting SVG.")
    }
  }

  public exportImageAsPDF(diagramName: string) {
    if (this.reactFlowInstance) {
      this.deSelectAllNodes()
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

      const { nodes, edges, diagramType } = result

      this.diagramType = diagramType
      // Trigger a re-render by calling renderApp after updating the diagramType
      this.renderApp()
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

  public createNewDiagram(diagramType: DiagramType) {
    this.diagramType = diagramType
    // Trigger a re-render by calling renderApp after updating the diagramType
    this.renderApp()

    if (this.reactFlowInstance) {
      this.reactFlowInstance.setNodes([])
      this.reactFlowInstance.setEdges([])
    } else {
      console.error(
        "ReactFlowInstance is not available for creating new diagram"
      )
    }
  }
}
