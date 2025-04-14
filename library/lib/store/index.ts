import { createDiagramStore } from "./diagramStore"
import { createMetadataStore } from "./metadataStore"
import { DiagramStore, MetadataStore } from "./types"
import { StoreApi, UseBoundStore } from "zustand"
import { observeYjsChanges } from "./yjsSync"

type StoreType = {
  diagramStore: UseBoundStore<StoreApi<DiagramStore>>
  metadataStore: UseBoundStore<StoreApi<MetadataStore>>
} | null

let useStore: StoreType = null

export const initStore = () => {
  if (!useStore) {
    useStore = {
      diagramStore: createDiagramStore(),
      metadataStore: createMetadataStore(),
    }
    observeYjsChanges()
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
  useStore = null
}

// Export hooks for convenience
export const useDiagramStore = () => getStore().diagramStore
export const useMetadataStore = () => getStore().metadataStore
