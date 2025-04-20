import * as Y from "yjs"
import { useDiagramStore } from "./index"
import { getNodesMap, getTextEditor, getYDoc } from "@/sync/ydoc"

enum MessageType {
  YjsSYNC = 0,
  YjsUpdate = 1,
}

type SendFunction = (data: Uint8Array) => void

export class YjsSyncClass {
  private stopYjsObserver: (() => void) | null = null
  private sendFunction: SendFunction | null = null

  public startSync() {
    if (!this.stopYjsObserver) {
      console.log("Starting Yjs observer")
      this.startYjsObserver()
      getYDoc().on("update", this.handleYjsUpdate)
    }
  }

  public stopSync() {
    if (this.stopYjsObserver) {
      this.stopYjsObserver()
      this.stopYjsObserver = null
    }
    getYDoc().off("update", this.handleYjsUpdate)
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
      // const fullMessage = new Uint8Array(1 + update.length)
      // fullMessage[0] = MessageType.YjsUpdate
      // fullMessage.set(update, 1)
      // this.sendFunction(fullMessage)
      const syncMessage = Y.encodeStateAsUpdate(getYDoc())
      const fullMessage = new Uint8Array(1 + syncMessage.length)
      fullMessage[0] = MessageType.YjsUpdate
      fullMessage.set(syncMessage, 1)
      this.sendFunction(fullMessage)
    } else {
      console.log(
        "Not sending Yjs update, transaction origin:",
        transaction.origin
      )
    }
  }

  public handleReceivedData = (data: Uint8Array) => {
    const messageType = data[0]

    console.log("Received message type:", messageType)
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
    getNodesMap().observe(() => {
      console.log("Yjs nodes map changed")
      useDiagramStore().getState().updateNodesFromYjs()
    })
    getTextEditor().observe(() => {
      console.log("Yjs text editor changed")
      useDiagramStore().getState().updateTextEditorFromYjs()
    })
  }
}
