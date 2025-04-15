import { createDiagramStore, DiagramStore } from "./diagramStore"
import { createMetadataStore, MetadataStore } from "./metadataStore"

import { StoreApi, UseBoundStore } from "zustand"
import { observeYjsChanges } from "./yjsSync"

type StoreType = {
  diagramStore: UseBoundStore<StoreApi<DiagramStore>>
  metadataStore: UseBoundStore<StoreApi<MetadataStore>>
} | null

let useStore: StoreType = null
let stopYjsObserver: (() => void) | null = null

export const initStore = () => {
  if (!useStore) {
    useStore = {
      diagramStore: createDiagramStore(),
      metadataStore: createMetadataStore(),
    }
    stopYjsObserver = observeYjsChanges()
  }
  return useStore
}

export const getStore = () => {
  if (!useStore) {
    throw new Error("Store not initialized. Call initStore() first.")
  }
  return useStore
}

export const killStore = () => {
  if (stopYjsObserver) {
    stopYjsObserver()
  }
  useStore = null
}

// Export hooks for convenience
export const useDiagramStore = () => getStore().diagramStore
export const useMetadataStore = () => getStore().metadataStore
