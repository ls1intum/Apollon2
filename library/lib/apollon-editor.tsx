import ReactDOM from "react-dom/client"
import { AppWithProvider } from "./App"
import { ReactFlowInstance, type Node, type Edge } from "@xyflow/react"
import {
  parseDiagramType,
  mapFromReactFlowNodeToApollonNode,
  mapFromReactFlowEdgeToApollonEdge,
  DeepPartial,
  getSVG,
  getDiagramBounds,
} from "./utils"
import { UMLDiagramType } from "./types"
import { createDiagramStore, DiagramStore } from "@/store/diagramStore"
import { createMetadataStore, MetadataStore } from "@/store/metadataStore"
import { createPopoverStore, PopoverStore } from "@/store/popoverStore"
import {
  createAssessmentSelectionStore,
  AssessmentSelectionStore,
} from "@/store/assessmentSelectionStore"
import {
  DiagramStoreContext,
  MetadataStoreContext,
  PopoverStoreContext,
  AssessmentSelectionStoreContext,
} from "./store/context"
import {
  MessageType,
  SendBroadcastMessage,
  YjsSyncClass,
} from "@/sync/yjsSyncClass"
import * as Y from "yjs"
import { StoreApi } from "zustand"
import * as Apollon from "./typings"
import { importDiagram } from "./utils/versionConverter"

export class ApollonEditor {
  private root: ReactDOM.Root
  private reactFlowInstance: ReactFlowInstance | null = null
  private readonly syncManager: YjsSyncClass
  private readonly ydoc: Y.Doc
  private readonly diagramStore: StoreApi<DiagramStore>
  private readonly metadataStore: StoreApi<MetadataStore>
  private readonly popoverStore: StoreApi<PopoverStore>
  private readonly assessmentSelectionStore: StoreApi<AssessmentSelectionStore>
  private subscribers: Apollon.Subscribers = {}
  constructor(element: HTMLElement, options?: Apollon.ApollonOptions) {
    if (!(element instanceof HTMLElement)) {
      throw new Error("Element is required to initialize Apollon2")
    }

    this.ydoc = new Y.Doc()
    this.diagramStore = createDiagramStore(this.ydoc)
    this.metadataStore = createMetadataStore(this.ydoc)
    this.popoverStore = createPopoverStore()
    this.assessmentSelectionStore = createAssessmentSelectionStore()
    this.syncManager = new YjsSyncClass(
      this.ydoc,
      this.diagramStore,
      this.metadataStore
    )
    const diagramId =
      options?.model?.id || Math.random().toString(36).substring(2, 15)

    this.root = ReactDOM.createRoot(element, {
      identifierPrefix: `apollon2-${diagramId}`,
    })

    this.diagramStore.getState().setDiagramId(diagramId)
    const diagramName = options?.model?.title || "Untitled Diagram"
    const diagramType =
      options?.type || options?.model?.type || UMLDiagramType.ClassDiagram
    this.metadataStore
      .getState()
      .updateMetaData(diagramName, parseDiagramType(diagramType))

    if (options?.model) {
      let processedModel: Apollon.UMLModel

      try {
        processedModel = importDiagram(options.model)

        const nodes = processedModel.nodes || []
        const edges = processedModel.edges || []
        const assessments = processedModel.assessments || {}

        this.diagramStore.getState().setNodesAndEdges(nodes, edges)
        this.diagramStore.getState().setAssessments(assessments)

        if (processedModel.title !== diagramName) {
          this.metadataStore.getState().updateDiagramTitle(processedModel.title)
        }
        if (processedModel.type !== diagramType) {
          this.metadataStore
            .getState()
            .updateDiagramType(parseDiagramType(processedModel.type))
        }
      } catch (error) {
        console.error("Using empty model due to conversion failure", error)
        this.diagramStore.getState().setNodesAndEdges([], [])
        this.diagramStore.getState().setAssessments({})
      }
    }

    if (options?.mode) {
      this.metadataStore.getState().setMode(options.mode)
    }
    if (options?.enablePopups !== undefined) {
      this.popoverStore.getState().setPopupEnabled(options.enablePopups)
    }
    if (options?.readonly !== undefined) {
      this.metadataStore.getState().setReadonly(options.readonly)
    }
    if (options?.debug !== undefined) {
      this.metadataStore.getState().setDebug(options.debug)
    }

    if (
      this.metadataStore.getState().mode === Apollon.ApollonMode.Modelling &&
      !options?.collaborationEnabled
    ) {
      this.diagramStore.getState().initializeUndoManager()
    }

    this.root.render(
      <DiagramStoreContext.Provider value={this.diagramStore}>
        <MetadataStoreContext.Provider value={this.metadataStore}>
          <PopoverStoreContext.Provider value={this.popoverStore}>
            <AssessmentSelectionStoreContext.Provider
              value={this.assessmentSelectionStore}
            >
              <AppWithProvider
                onReactFlowInit={this.setReactFlowInstance.bind(this)}
              />
            </AssessmentSelectionStoreContext.Provider>
          </PopoverStoreContext.Provider>
        </MetadataStoreContext.Provider>
      </DiagramStoreContext.Provider>
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

  public getEdges(): Edge[] {
    return this.reactFlowInstance ? this.reactFlowInstance.getEdges() : []
  }

  set diagramType(type: UMLDiagramType) {
    this.metadataStore.getState().updateDiagramType(type)
    this.diagramStore.getState().setNodesAndEdges([], [])
    this.diagramStore.getState().setAssessments({})
  }

  public destroy() {
    const diagramId = this.diagramStore.getState().diagramId
    console.log("Disposing Apollon2 instance with diagramId", diagramId)

    try {
      Object.keys(this.subscribers).forEach((subscriberId) => {
        const unsubscribeCallback = this.subscribers[parseInt(subscriberId)]
        if (unsubscribeCallback) {
          unsubscribeCallback()
        }
      })
      this.subscribers = {}
      this.syncManager.stopSync()
      this.root.unmount()
      this.ydoc.destroy()
      this.reactFlowInstance = null
    } catch (error) {
      console.error("Error during Apollon2 disposal:", error)
    }
  }

  /**
   * renders a model as a svg and returns it. Therefore the svg is temporarily added to the dom and removed after it has been rendered.
   * @param model the apollon model to export as a svg
   * @param options options to change the export behavior (add margin, exclude element ...)
   * @param theme the theme which should be applied on the svg
   */
  static async exportModelAsSvg(
    model: Apollon.UMLModel,
    options?: Apollon.ExportOptions,
    theme?: DeepPartial<Apollon.Styles>
  ): Promise<Apollon.SVG> {
    console.log("Exporting model as SVG options", options)
    console.log("Exporting model as SVG theme", theme)
    const container = document.createElement("div")
    container.style.display = "flex"
    container.style.width = "100px"
    container.style.height = "100px"
    container.style.zIndex = "-1000"
    container.style.top = "0"
    container.style.position = "absolute"
    container.style.left = "-99px"

    document.body.appendChild(container)

    const ydoc = new Y.Doc()
    const diagramStore = createDiagramStore(ydoc)
    const metadataStore = createMetadataStore(ydoc)
    const popoverStore = createPopoverStore()
    const assessmentSelectionStore = createAssessmentSelectionStore()
    const diagramId = Math.random().toString(36).substring(2, 15)

    let setReactFlowInstance: (instance: ReactFlowInstance) => void = () => {}

    const reactFlowInstancePromise = new Promise<ReactFlowInstance>(
      (resolve) => {
        setReactFlowInstance = resolve
      }
    )

    const svgRoot = ReactDOM.createRoot(container, {
      identifierPrefix: `apollon2-exportAsSVG-${diagramId}`,
    })

    diagramStore.getState().setNodesAndEdges(model.nodes, model.edges)
    diagramStore.getState().setAssessments(model.assessments)
    svgRoot.render(
      <DiagramStoreContext.Provider value={diagramStore}>
        <MetadataStoreContext.Provider value={metadataStore}>
          <PopoverStoreContext.Provider value={popoverStore}>
            <AssessmentSelectionStoreContext.Provider
              value={assessmentSelectionStore}
            >
              <AppWithProvider onReactFlowInit={setReactFlowInstance} />
            </AssessmentSelectionStoreContext.Provider>
          </PopoverStoreContext.Provider>
        </MetadataStoreContext.Provider>
      </DiagramStoreContext.Provider>
    )

    // Wait for React Flow to initialize
    // Create a timeout promise that resolves to undefined after 3 seconds
    const timeoutPromise = new Promise<null>((resolve) => {
      setTimeout(() => resolve(null), 3000)
    })

    const reactFlowInstance = await Promise.race([
      reactFlowInstancePromise,
      timeoutPromise,
    ])

    if (!reactFlowInstance) {
      document.body.removeChild(container)
      console.error("React Flow instance not initialized during SVG export")
      throw new Error("React Flow instance not initialized")
    }

    const bounds = getDiagramBounds(reactFlowInstance)

    const margin = 20
    const clip = {
      x: bounds.x - margin,
      y: bounds.y - margin,
      width: bounds.width + margin * 2,
      height: bounds.height + margin * 2,
    }

    const svgString = getSVG(container, clip)

    // Clean up
    svgRoot.unmount()
    document.body.removeChild(container)
    ydoc.destroy()

    return {
      svg: svgString,
      clip,
    }
  }

  /**
   * exports current model as svg
   * @param options options to change the export behavior (add margin, exclude element ...)
   */
  exportAsSVG(options?: Apollon.ExportOptions): Promise<Apollon.SVG> {
    return ApollonEditor.exportModelAsSvg(this.model, options)
  }

  private getNewSubscriptionId(): number {
    const subscribers = this.subscribers
    if (Object.keys(subscribers).length === 0) return 0
    return Math.max(...Object.keys(subscribers).map((key) => parseInt(key))) + 1
  }

  public subscribeToModelChange(
    callback: (state: Apollon.UMLModel) => void
  ): number {
    const subscriberId = this.getNewSubscriptionId()
    const unsubscribeCallback = this.diagramStore.subscribe(() =>
      callback(this.model)
    )
    this.subscribers[subscriberId] = unsubscribeCallback
    return subscriberId
  }

  public subscribeToDiagramNameChange(
    callback: (diagramTitle: string) => void
  ) {
    const subscriberId = this.getNewSubscriptionId()
    const unsubscribeCallback = this.metadataStore.subscribe((state) =>
      callback(state.diagramTitle)
    )
    this.subscribers[subscriberId] = unsubscribeCallback
    return subscriberId
  }

  public subscribeToAssessmentSelection(
    callback: (selectedElementIds: string[]) => void
  ) {
    const subscriberId = this.getNewSubscriptionId()
    const unsubscribeCallback = this.assessmentSelectionStore.subscribe(
      (state) => callback(state.selectedElementIds)
    )
    this.subscribers[subscriberId] = unsubscribeCallback
    return subscriberId
  }

  public unsubscribe(subscriberId: number) {
    const unsubscribeCallback = this.subscribers[subscriberId]
    if (unsubscribeCallback) {
      unsubscribeCallback()
      delete this.subscribers[subscriberId]
    } else {
      console.warn(
        `No subscriber found with ID ${subscriberId}. Unable to unsubscribe.`
      )
    }
  }

  public sendBroadcastMessage(sendFn: SendBroadcastMessage) {
    this.syncManager.setSendBroadcastMessage(sendFn)
  }

  public receiveBroadcastedMessage(base64Data: string) {
    this.syncManager.handleReceivedData(base64Data)
  }

  public updateDiagramTitle(name: string) {
    this.metadataStore.getState().updateDiagramTitle(name)
  }

  public getDiagramMetadata() {
    const { diagramTitle, diagramType } = this.metadataStore.getState()
    return { diagramTitle, diagramType }
  }

  get model(): Apollon.UMLModel {
    console.log("Getting model")

    const { nodes, edges, diagramId } = this.diagramStore.getState()
    const { diagramTitle, diagramType } = this.metadataStore.getState()
    console.log("Nodes:", nodes, edges)
    return {
      id: diagramId,
      version: "4.0.0",
      title: diagramTitle,
      type: diagramType,
      nodes: nodes.map((node) => mapFromReactFlowNodeToApollonNode(node)),
      edges: edges.map((edge) => mapFromReactFlowEdgeToApollonEdge(edge)),
      assessments: this.diagramStore.getState().assessments,
    }
    //return this.model
  }

  set model(model: Apollon.UMLModel) {
    console.log("Setting model", model)
    const newmodel = importDiagram(model)
    const { nodes, edges, assessments } = newmodel
    this.diagramStore.getState().setNodesAndEdges(nodes, edges)
    this.diagramStore.getState().setAssessments(assessments)
    this.metadataStore
      .getState()
      .updateMetaData(newmodel.title, parseDiagramType(newmodel.type))
  }

  public getSelectedElements(): string[] {
    return this.assessmentSelectionStore.getState().selectedElementIds
  }

  public addOrUpdateAssessment(assessment: Apollon.Assessment): void {
    this.diagramStore.getState().addOrUpdateAssessment(assessment)
  }

  static generateInitialSyncMessage(): string {
    const syncMessage = new Uint8Array(new Uint8Array([MessageType.YjsSYNC]))
    return YjsSyncClass.uint8ToBase64(syncMessage)
  }
}
