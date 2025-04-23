import { createDiagramStore, DiagramStore } from "./diagramStore"
import { createMetadataStore, MetadataStore } from "./metadataStore"
import { StoreApi, UseBoundStore } from "zustand"

type StoreType = {
  diagramStore: UseBoundStore<StoreApi<DiagramStore>>
  metadataStore: UseBoundStore<StoreApi<MetadataStore>>
} | null

let useStore: StoreType = null

export const getStore = () => {
  if (!useStore) {
    useStore = {
      diagramStore: createDiagramStore(),
      metadataStore: createMetadataStore(),
    }
  }
  return useStore
}

export const resetZustandStore = () => {
  useStore?.diagramStore().reset()
  useStore?.metadataStore().reset()
  useStore = null
}

// Export hooks for convenience
export const useDiagramStore = () => getStore().diagramStore
export const useMetadataStore = () => getStore().metadataStore
