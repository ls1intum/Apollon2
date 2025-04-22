import * as Y from "yjs"
import { useDiagramStore, useMetadataStore } from "./index"
import {
  getDiagramMetadata,
  getEdgesMap,
  getNodesMap,
  getYDoc,
} from "@/sync/ydoc"
import { Edge, Node } from "@xyflow/react"

enum MessageType {
  YjsSYNC = 0,
  YjsUpdate = 1,
}

type SendFunction = (data: Uint8Array) => void

export class YjsSyncClass {
  private stopYjsObserver: (() => void) | null = null
  private sendFunction: SendFunction | null = null

  constructor() {
    if (!this.stopYjsObserver) {
      this.stopYjsObserver = this.startYjsObserver()
      getYDoc().on("update", this.handleYjsUpdate)
    }
  }

  public stopSync() {
    getYDoc().off("update", this.handleYjsUpdate)

    if (this.stopYjsObserver) {
      this.stopYjsObserver()
      this.stopYjsObserver = null
    }
  }

  public setSendFunction = (sendFn: SendFunction) => {
    this.sendFunction = sendFn
  }

  public applyUpdate = (update: Uint8Array, transactionOrigin: string) => {
    Y.applyUpdate(getYDoc(), update, transactionOrigin)
  }

  private handleYjsUpdate: (
    arg0: Uint8Array,
    arg1: unknown,
    arg2: Y.Doc,
    arg3: Y.Transaction
  ) => void = (_update: Uint8Array, _arg1, _arg2, transaction) => {
    if (this.sendFunction && transaction.origin === "store") {
      const syncMessage = Y.encodeStateAsUpdate(getYDoc())
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
        const syncMessage = Y.encodeStateAsUpdate(getYDoc())
        const fullMessage = new Uint8Array(1 + syncMessage.length)
        fullMessage[0] = MessageType.YjsUpdate
        fullMessage.set(syncMessage, 1)
        this.sendFunction(fullMessage)
      }
    }
  }
  private startYjsObserver = () => {
    const nodesChangeObserver = (
      _arg0: Y.YMapEvent<Node>,
      transaction: Y.Transaction
    ) => {
      if (transaction.origin !== "store") {
        useDiagramStore().getState().updateNodesFromYjs()
      }
    }

    const EdgesObserving = (
      _arg0: Y.YMapEvent<Edge>,
      transaction: Y.Transaction
    ) => {
      if (transaction.origin !== "store") {
        useMetadataStore().getState().updateMetaDataFromYjs()
      }
    }

    const MetadataOverserving = (
      _arg0: Y.YMapEvent<string>,
      transaction: Y.Transaction
    ) => {
      if (transaction.origin !== "store") {
        useMetadataStore().getState().updateMetaDataFromYjs()
      }
    }
    getNodesMap().observe(nodesChangeObserver)
    getEdgesMap().observe(EdgesObserving)
    getDiagramMetadata().observe(MetadataOverserving)
    return () => {
      getNodesMap().unobserve(nodesChangeObserver)
      getEdgesMap().unobserve(EdgesObserving)
      getDiagramMetadata().unobserve(MetadataOverserving)
    }
  }
}
