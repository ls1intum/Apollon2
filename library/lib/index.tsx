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
import { ApollonOptions } from "./types/EditorOptions"
import {
  createDiagramStore,
  DiagramStore,
  DiagramStoreData,
} from "./store/diagramStore"
import { createMetadataStore, MetadataStore } from "./store/metadataStore"
import { DiagramStoreContext, MetadataStoreContext } from "./store/context"
import { YjsSyncClass } from "./store/yjsSync"
import * as Y from "yjs"
import { StoreApi } from "zustand"

export class Apollon2 {
  private root: ReactDOM.Root
  private reactFlowInstance: ReactFlowInstance | null = null
  private diagramType: DiagramType
  private readonlyDiagram: boolean = false
  private readonly syncManager: YjsSyncClass
  private readonly ydoc: Y.Doc
  private readonly diagramStore: StoreApi<DiagramStore>
  private readonly metadataStore: StoreApi<MetadataStore>

  constructor(element: HTMLElement, options?: ApollonOptions) {
    this.ydoc = new Y.Doc()
    console.log(
      "Apollon2 initializing with Yjs document ydoc.clientId",
      this.ydoc.clientID
    )
    this.diagramStore = createDiagramStore(this.ydoc)
    this.metadataStore = createMetadataStore(this.ydoc)
    this.syncManager = new YjsSyncClass(
      this.ydoc,
      this.diagramStore,
      this.metadataStore
    )

    const diagramId =
      options?.model?.id || Math.random().toString(36).substring(2, 15)
    console.log("Apollon2 initializing with diagramId", diagramId)

    // Initialize React root
    this.root = ReactDOM.createRoot(element, {
      identifierPrefix: `apollon2-${diagramId}`,
    })
    this.diagramStore.getState().setDiagramId(diagramId)

    // Initialize metadata and diagram type
    const diagramName = options?.model?.name || "Untitled Diagram"
    const diagramType = options?.model?.type || DiagramType.ClassDiagram
    this.metadataStore.getState().updateMetaData(diagramName, diagramType)
    this.diagramType = parseDiagramType(
      this.ydoc.getMap<string>("diagramMetadata").get("diagramType") ||
        diagramType
    )

    // Apply initial nodes and edges if provided
    if (options?.model) {
      const nodes = options.model.nodes || []
      const edges = options.model.edges || []
      this.diagramStore.getState().setNodesAndEdges(nodes, edges)
      this.readonlyDiagram = options.readonly || false
    }

    this.renderApp()
  }

  private renderApp() {
    this.root.render(
      <div
        style={{ display: "flex", width: "100%", height: "100%", flexGrow: 1 }}
      >
        <DiagramStoreContext.Provider value={this.diagramStore}>
          <MetadataStoreContext.Provider value={this.metadataStore}>
            <AppWithProvider
              onReactFlowInit={this.setReactFlowInstance.bind(this)}
              readonlyDiagram={this.readonlyDiagram}
            />
          </MetadataStoreContext.Provider>
        </DiagramStoreContext.Provider>
      </div>
    )
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
    this.diagramStore.getState().setNodesAndEdges([], [])
  }

  public dispose() {
    const diagramId = this.diagramStore.getState().diagramId
    console.log("Disposing Apollon2 instance with diagramId", diagramId)

    try {
      this.syncManager.stopSync()
      this.root.unmount()
      this.ydoc.destroy()
      this.reactFlowInstance = null
      // Zustand stores are automatically garbage-collected when references are gone
    } catch (error) {
      console.error("Error during Apollon2 disposal:", error)
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
      const result = validateParsedJSON(parsed)
      if (typeof result === "string") return result

      const { nodes, edges, diagramType } = result
      this.diagramType = diagramType
      this.diagramStore.getState().setNodesAndEdges(nodes, edges)
      this.metadataStore
        .getState()
        .updateMetaData(parsed.name || "Imported Diagram", diagramType)
      this.renderApp()
      this.reactFlowInstance.setNodes(nodes)
      this.reactFlowInstance.setEdges(edges)
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
    this.metadataStore
      .getState()
      .updateMetaData("Untitled Diagram", diagramType)
    this.diagramStore.getState().setNodesAndEdges([], [])
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
    return this.diagramStore.subscribe((state) =>
      callback({
        nodes: state.nodes,
        edges: state.edges,
      })
    )
  }

  public subscribeToDiagramNameChange(callback: (diagramName: string) => void) {
    return this.metadataStore.subscribe((state) => callback(state.diagramName))
  }

  public sendBroadcastMessage(sendFn: (data: Uint8Array) => void) {
    this.syncManager.setSendFunction(sendFn)
  }

  public receiveBroadcastedMessage(update: Uint8Array) {
    this.syncManager.handleReceivedData(update)
  }

  public updateDiagramName(name: string) {
    this.metadataStore.getState().updateMetaData(name, this.diagramType)
  }

  public getDiagramMetadata() {
    const { diagramName, diagramType } = this.metadataStore.getState()
    return { diagramName, diagramType }
  }
}
