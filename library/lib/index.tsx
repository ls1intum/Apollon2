import ReactDOM from "react-dom/client"
import { AppWithProvider } from "./App"
import { ReactFlowInstance, type Node, type Edge } from "@xyflow/react"
import {
  exportAsPNG,
  exportAsSVG,
  exportAsPDF,
  exportAsJSON,
  validateParsedJSON,
  parseDiagramType,
} from "./utils"
import { DiagramType } from "./types"
export * from "./types"
import { WebsocketProvider } from "y-websocket"
import ydoc from "./sync/ydoc"
import {
  initStore,
  killStore,
  useDiagramStore,
  useMetadataStore,
} from "./store"

import { ApollonOptions } from "./types/EditorOptions"
import { edgesMap, nodesMap } from "./store/constants"
import { DiagramStoreData } from "./store/types"

export class Apollon2 {
  private root: ReactDOM.Root | null = null
  private reactFlowInstance: ReactFlowInstance | null = null
  private diagramType: DiagramType
  private readonlyDiagram: boolean = false

  constructor(element: HTMLElement, options?: ApollonOptions) {
    initStore()
    this.root = ReactDOM.createRoot(element)
    const diagramName = options?.model?.name || "Untitled Diagram"
    const diagramType = options?.model?.type || DiagramType.ClassDiagram
    ydoc.getMap<string>("diagramMetadata").set("diagramName", diagramName)
    ydoc.getMap<string>("diagramMetadata").set("diagramType", diagramType)

    this.diagramType = parseDiagramType(
      ydoc.getMap<string>("diagramMetadata").get("diagramType")
    )
    if (options) {
      const nodes = options?.model?.nodes || []
      const edges = options?.model?.edges || []

      for (const node of nodes) {
        nodesMap.set(node.id, node)
      }
      for (const edge of edges) {
        edgesMap.set(edge.id, edge)
      }

      this.readonlyDiagram = options?.readonly || false
    }

    this.renderApp()
  }

  private renderApp() {
    if (this.root) {
      this.root.render(
        <AppWithProvider
          onReactFlowInit={this.setReactFlowInstance.bind(this)}
          readonlyDiagram={this.readonlyDiagram}
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
      killStore()
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

  public subscribeToModalNodeEdgeChange(
    callback: (state: DiagramStoreData) => void
  ) {
    return useDiagramStore().subscribe((state) =>
      callback({
        nodes: state.nodes,
        edges: state.edges,
      })
    )
  }

  public subscribeToDiagramNameChange(callback: (diagramName: string) => void) {
    return useMetadataStore().subscribe((state) => {
      callback(state.diagramName)
    })
  }

  public makeWebsocketConnection(serverUrl: string, roomname: string) {
    const wsProvider = new WebsocketProvider(serverUrl, roomname, ydoc)

    wsProvider.on("status", ({ status }) => {
      console.log("WebSocket status:", status)
    })
    wsProvider.on("connection-error", (error) => {
      console.error("WebSocket connection error:", error)
    })
    wsProvider.on("connection-close", (event) => {
      console.log("WebSocket closed:", event)
    })
  }

  public updateDiagramName(name: string) {
    ydoc.getMap<string>("diagramMetadata").set("diagramName", name)
  }

  public getDiagramMetadata() {
    const metadata = ydoc.getMap<string>("diagramMetadata")
    const diagramName = metadata.get("diagramName")
    const diagramType = parseDiagramType(metadata.get("diagramType"))
    return {
      diagramName,
      diagramType,
    }
  }
}
