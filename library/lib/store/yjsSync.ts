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
  private readonly stopYjsObserver: () => void
  private sendFunction: SendFunction | null = null
  private readonly ydoc: Y.Doc
  private readonly diagramStore: StoreApi<DiagramStore>
  private readonly metadataStore: StoreApi<MetadataStore>

  constructor(
    ydoc: Y.Doc,
    diagramStore: StoreApi<DiagramStore>,
    metadataStore: StoreApi<MetadataStore>
  ) {
    this.ydoc = ydoc
    this.diagramStore = diagramStore
    this.metadataStore = metadataStore
    this.stopYjsObserver = this.startYjsObserver()
  }

  public stopSync() {
    this.stopYjsObserver()
  }

  public setSendFunction = (sendFn: SendFunction) => {
    this.sendFunction = sendFn
  }

  public applyUpdate = (update: Uint8Array, transactionOrigin: string) => {
    Y.applyUpdate(this.ydoc, update, transactionOrigin)
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

    const handleYjsUpdate = (
      _arg0: unknown,
      _arg1: unknown,
      _arg2: Y.Doc,
      transaction: Y.Transaction
    ) => {
      if (this.sendFunction && transaction.origin === "store") {
        const syncMessage = Y.encodeStateAsUpdate(this.ydoc)
        const fullMessage = new Uint8Array(1 + syncMessage.length)
        fullMessage[0] = MessageType.YjsUpdate
        fullMessage.set(syncMessage, 1)
        this.sendFunction(fullMessage)
      }
    }

    getNodesMap(this.ydoc).observe(nodesChangeObserver)
    getEdgesMap(this.ydoc).observe(edgesObserver)
    getDiagramMetadata(this.ydoc).observe(metadataObserver)
    this.ydoc.on("update", handleYjsUpdate)
    return () => {
      getNodesMap(this.ydoc).unobserve(nodesChangeObserver)
      getEdgesMap(this.ydoc).unobserve(edgesObserver)
      getDiagramMetadata(this.ydoc).unobserve(metadataObserver)
      this.ydoc.off("update", handleYjsUpdate)
    }
  }
}
