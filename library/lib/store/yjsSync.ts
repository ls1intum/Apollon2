import * as Y from "yjs"
import { StoreApi } from "zustand"
import { DiagramStore } from "./diagramStore"
import { MetadataStore } from "./metadataStore"
import { getDiagramMetadata, getEdgesMap, getNodesMap } from "@/sync/ydoc"
import { Edge, Node } from "@xyflow/react"

enum MessageType {
  YjsSYNC = 0,
  YjsUpdate = 1,
}

type SendFunction = (data: Uint8Array) => void

export class YjsSyncClass {
  private stopYjsObserver: (() => void) | null = null
  private sendFunction: SendFunction | null = null
  private readonly ydoc: Y.Doc
  private readonly diagramStore: StoreApi<DiagramStore>
  private readonly metadataStore: StoreApi<MetadataStore>

  constructor(
    ydoc: Y.Doc,
    diagramStore: StoreApi<DiagramStore>,
    metadataStore: StoreApi<MetadataStore>
  ) {
    console.log("YjsSyncClass constructor initialized")
    this.ydoc = ydoc
    this.diagramStore = diagramStore
    this.metadataStore = metadataStore
    if (!this.stopYjsObserver) {
      console.log("YjsSyncClass constructor Starting Yjs observer")
      this.stopYjsObserver = this.startYjsObserver()
      this.ydoc.on("update", this.handleYjsUpdate)
    }
  }

  public stopSync() {
    console.log("YjsSyncClass stopSync called")
    this.ydoc.off("update", this.handleYjsUpdate)

    if (this.stopYjsObserver) {
      this.stopYjsObserver()
      this.stopYjsObserver = null
    }
  }

  public setSendFunction = (sendFn: SendFunction) => {
    this.sendFunction = sendFn
  }

  public applyUpdate = (update: Uint8Array, transactionOrigin: string) => {
    Y.applyUpdate(this.ydoc, update, transactionOrigin)
  }

  private handleYjsUpdate: (
    update: Uint8Array,
    origin: unknown,
    doc: Y.Doc,
    transaction: Y.Transaction
  ) => void = (_update: Uint8Array, _origin, _doc, transaction) => {
    if (this.sendFunction && transaction.origin === "store") {
      const syncMessage = Y.encodeStateAsUpdate(this.ydoc)
      const fullMessage = new Uint8Array(1 + syncMessage.length)
      fullMessage[0] = MessageType.YjsUpdate
      fullMessage.set(syncMessage, 1)
      this.sendFunction(fullMessage)
    }
  }

  public handleReceivedData = (data: Uint8Array) => {
    const messageType = data[0]

    if (messageType === MessageType.YjsUpdate) {
      const update = data.slice(1)
      this.applyUpdate(update, "remote")
    } else if (messageType === MessageType.YjsSYNC) {
      if (this.sendFunction) {
        const syncMessage = Y.encodeStateAsUpdate(this.ydoc)
        const fullMessage = new Uint8Array(1 + syncMessage.length)
        fullMessage[0] = MessageType.YjsUpdate
        fullMessage.set(syncMessage, 1)
        this.sendFunction(fullMessage)
      }
    }
  }

  private startYjsObserver = () => {
    const nodesChangeObserver = (
      _event: Y.YMapEvent<Node>,
      transaction: Y.Transaction
    ) => {
      if (transaction.origin !== "store") {
        this.diagramStore.getState().updateNodesFromYjs()
      }
    }

    const edgesObserver = (
      _event: Y.YMapEvent<Edge>,
      transaction: Y.Transaction
    ) => {
      if (transaction.origin !== "store") {
        this.diagramStore.getState().updateEdgesFromYjs()
      }
    }

    const metadataObserver = (
      _event: Y.YMapEvent<string>,
      transaction: Y.Transaction
    ) => {
      if (transaction.origin !== "store") {
        this.metadataStore.getState().updateMetaDataFromYjs()
      }
    }

    getNodesMap(this.ydoc).observe(nodesChangeObserver)
    getEdgesMap(this.ydoc).observe(edgesObserver)
    getDiagramMetadata(this.ydoc).observe(metadataObserver)
    return () => {
      getNodesMap(this.ydoc).unobserve(nodesChangeObserver)
      getEdgesMap(this.ydoc).unobserve(edgesObserver)
      getDiagramMetadata(this.ydoc).unobserve(metadataObserver)
    }
  }
}
