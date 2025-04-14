/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Y from "yjs"
import { nodesMap, edgesMap, diagramMetadata } from "./constants"
import { getStore } from "./index"

export const observeYjsChanges = () => {
  const updateNodes = (
    _events: Y.YEvent<any>[],
    transaction: Y.Transaction
  ) => {
    console.log("Nodes updated from Yjs _events:", _events)
    console.log("Nodes updated from Yjs transaction:", transaction)
    if (transaction.origin !== "store") {
      getStore().diagramStore.getState().updateNodesFromYjs()
    }
  }

  const updateEdges = (
    _events: Y.YEvent<any>[],
    transaction: Y.Transaction
  ) => {
    if (transaction.origin !== "store") {
      getStore().diagramStore.getState().updateEdgesFromYjs()
    }
  }

  const updateMetaData = (
    _events: Y.YEvent<any>[],
    transaction: Y.Transaction
  ) => {
    if (transaction.origin !== "store") {
      getStore().metadataStore.getState().updateMetaDataFromYjs()
    }
  }

  nodesMap.observeDeep(updateNodes)
  edgesMap.observeDeep(updateEdges)
  diagramMetadata.observeDeep(updateMetaData)

  // Return cleanup function
  return () => {
    nodesMap.unobserveDeep(updateNodes)
    edgesMap.unobserveDeep(updateEdges)
    diagramMetadata.unobserveDeep(updateMetaData)
  }
}
