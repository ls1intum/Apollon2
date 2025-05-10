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
  mapFromReactFlowNodeToApollonNode,
  mapFromReactFlowEdgeToApollonEdge,
} from "./utils"
import { DiagramType } from "./types"
export * from "./types"
import { ApollonDiagram, ApollonOptions } from "./types/EditorOptions"
import {
  createDiagramStore,
  DiagramStore,
  DiagramStoreData,
} from "./store/diagramStore"
import { createMetadataStore, MetadataStore } from "./store/metadataStore"
import {
  DiagramStoreContext,
  MetadataStoreContext,
  PopoverStoreContext,
} from "./store/context"
import { YjsSyncClass } from "./store/yjsSync"
import * as Y from "yjs"
import { StoreApi } from "zustand"
import { createPopoverStore } from "./store"
import { PopoverStore } from "./store/popoverStore"

export class Apollon2 {
  private root: ReactDOM.Root
  private reactFlowInstance: ReactFlowInstance | null = null
  private readonly syncManager: YjsSyncClass
  private readonly ydoc: Y.Doc
  private readonly diagramStore: StoreApi<DiagramStore>
  private readonly metadataStore: StoreApi<MetadataStore>
  private readonly popoverStore: StoreApi<PopoverStore>

  constructor(element: HTMLElement, options?: ApollonOptions) {
    if (!(element instanceof HTMLElement)) {
      throw new Error("Element is required to initialize Apollon2")
    }

    this.ydoc = new Y.Doc()
    this.diagramStore = createDiagramStore(this.ydoc)
    this.metadataStore = createMetadataStore(this.ydoc)
    this.popoverStore = createPopoverStore()
    this.syncManager = new YjsSyncClass(
      this.ydoc,
      this.diagramStore,
      this.metadataStore
    )

    const diagramId =
      options?.model?.id || Math.random().toString(36).substring(2, 15)

    console.log("Diagram constructor called with diagramId", diagramId)
    // Initialize React root
    this.root = ReactDOM.createRoot(element, {
      identifierPrefix: `apollon2-${diagramId}`,
    })

    this.diagramStore.getState().setDiagramId(diagramId)

    // Initialize metadata and diagram type
    const diagramName = options?.model?.title || "Untitled Diagram"
    const diagramType = options?.model?.type || DiagramType.ClassDiagram
    this.metadataStore
      .getState()
      .updateMetaData(diagramName, parseDiagramType(diagramType))

    if (options?.model) {
      const nodes = options.model.nodes || []
      const edges = options.model.edges || []
      const assessments = options.model.assessments || {}
      this.diagramStore.getState().setNodesAndEdges(nodes, edges)
      this.diagramStore.getState().setAssessments(assessments)
    }

    if (options?.mode) {
      this.metadataStore.getState().setMode(options.mode)
    }
    if (options?.enablePopups) {
      this.metadataStore.getState().setPopupEnabled(options.enablePopups)
    }
    if (options?.readonly) {
      this.metadataStore.getState().setReadonly(options.readonly)
    }

    this.renderApp()
  }

  private renderApp() {
    this.root.render(
      <DiagramStoreContext.Provider value={this.diagramStore}>
        <MetadataStoreContext.Provider value={this.metadataStore}>
          <PopoverStoreContext.Provider value={this.popoverStore}>
            <AppWithProvider
              onReactFlowInit={this.setReactFlowInstance.bind(this)}
            />
          </PopoverStoreContext.Provider>
        </MetadataStoreContext.Provider>
      </DiagramStoreContext.Provider>
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
    if (this.reactFlowInstance) {
      return this.reactFlowInstance.getNodes()
    }
    return []
  }

  public getEdges(): Edge[] {
    return this.reactFlowInstance ? this.reactFlowInstance.getEdges() : []
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

  public exportAsJson() {
    if (this.reactFlowInstance) {
      this.deSelectAllNodes()
      const diagramTitle = this.metadataStore.getState().diagramTitle
      const diagram = this.getDiagram()
      exportAsJSON(diagram, diagramTitle)
    } else {
      console.error("ReactFlowInstance is not available for exporting JSON.")
    }
  }

  public exportImagePNG(isBackgroundTransparent: boolean = false) {
    if (this.reactFlowInstance) {
      const diagramTitle = this.metadataStore.getState().diagramTitle
      this.deSelectAllNodes()

      exportAsPNG(diagramTitle, this.reactFlowInstance, isBackgroundTransparent)
    } else {
      console.error("ReactFlowInstance is not available for exporting PNG.")
    }
  }

  public exportImageAsSVG() {
    if (this.reactFlowInstance) {
      this.deSelectAllNodes()
      const diagramTitle = this.metadataStore.getState().diagramTitle

      exportAsSVG(diagramTitle, this.reactFlowInstance)
    } else {
      console.error("ReactFlowInstance is not available for exporting SVG.")
    }
  }

  public exportImageAsPDF() {
    if (this.reactFlowInstance) {
      this.deSelectAllNodes()
      const diagramTitle = this.metadataStore.getState().diagramTitle

      exportAsPDF(diagramTitle, this.reactFlowInstance)
    } else {
      console.error("ReactFlowInstance is not available for exporting PDF.")
    }
  }

  public async importJson(content: string): Promise<boolean | string> {
    if (this.reactFlowInstance) {
      const parsed = JSON.parse(content)
      const result = validateParsedJSON(parsed)
      if (typeof result === "string") return result

      const { nodes, edges, type, title } = result

      this.diagramStore.getState().setNodesAndEdges(nodes, edges)
      this.metadataStore
        .getState()
        .updateMetaData(title || "Imported Diagram", type)
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

  public subscribeToDiagramNameChange(
    callback: (diagramTitle: string) => void
  ) {
    return this.metadataStore.subscribe((state) => callback(state.diagramTitle))
  }

  public sendBroadcastMessage(sendFn: (data: Uint8Array) => void) {
    this.syncManager.setSendFunction(sendFn)
  }

  public receiveBroadcastedMessage(update: Uint8Array) {
    this.syncManager.handleReceivedData(update)
  }

  public updateDiagramTitle(name: string) {
    this.metadataStore.getState().updateDiagramTitle(name)
  }

  public getDiagramMetadata() {
    const { diagramTitle, diagramType } = this.metadataStore.getState()
    return { diagramTitle, diagramType }
  }

  public getDiagram(): ApollonDiagram {
    const { nodes, edges, diagramId } = this.diagramStore.getState()
    const { diagramTitle, diagramType } = this.metadataStore.getState()
    return {
      id: diagramId,
      version: "2.0",
      title: diagramTitle,
      type: diagramType,
      nodes: nodes.map((node) => mapFromReactFlowNodeToApollonNode(node)),
      edges: edges.map((edge) => mapFromReactFlowEdgeToApollonEdge(edge)),
      assessments: this.diagramStore.getState().assessments,
    }
  }
}
