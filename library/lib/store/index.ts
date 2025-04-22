import { createDiagramStore, DiagramStore } from "./diagramStore"
import { createMetadataStore, MetadataStore } from "./metadataStore"
import { StoreApi, UseBoundStore } from "zustand"

type StoreType = {
  diagramStore: UseBoundStore<StoreApi<DiagramStore>>
  metadataStore: UseBoundStore<StoreApi<MetadataStore>>
} | null

let useStore: StoreType = null

export const initStore = () => {
  console.log("Initializing store, useStore:", useStore)
  if (!useStore) {
    useStore = {
      diagramStore: createDiagramStore(),
      metadataStore: createMetadataStore(),
    }
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
