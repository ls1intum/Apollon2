import { Node, Edge } from "@xyflow/react"
import * as Y from "yjs"
import { Cursor } from "./type"

let ydoc: Y.Doc | null = null

export const getYDoc = () => {
  if (!ydoc) {
    throw new Error("Y.Doc not initialized. Call initYDoc() first.")
  }
  return ydoc
}

export const setYDoc = () => {
  if (!ydoc) {
    ydoc = new Y.Doc()
    console.log("Y.Doc initialized, clientID:", ydoc.clientID)
  }
}

export const getNodesMap = () => getYDoc().getMap<Node>("nodes")
export const getEdgesMap = () => getYDoc().getMap<Edge>("edges")
export const getDiagramMetadata = () =>
  getYDoc().getMap<string>("diagramMetadata")
export const getCursorsMap = () => getYDoc().getMap<Cursor>("cursors")

export const clearYDoc = () => {
  if (ydoc) {
    ydoc.destroy()
    ydoc = null
  }
}

export default ydoc
