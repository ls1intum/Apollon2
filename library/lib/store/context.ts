import { createContext, useContext } from "react"
import { StoreApi, useStore } from "zustand"
import { DiagramStore } from "./diagramStore"
import { MetadataStore } from "./metadataStore"
import { PopoverStore } from "./popoverStore"

export const DiagramStoreContext = createContext<StoreApi<DiagramStore> | null>(
  null
)

export const MetadataStoreContext =
  createContext<StoreApi<MetadataStore> | null>(null)

export const PopoverStoreContext = createContext<StoreApi<PopoverStore> | null>(
  null
)

// Custom hooks for components
export const useDiagramStore = <T>(selector: (state: DiagramStore) => T): T => {
  const store = useContext(DiagramStoreContext)
  if (!store) throw new Error("DiagramStoreContext not provided")
  return useStore(store, selector)
}

export const useMetadataStore = <T>(
  selector: (state: MetadataStore) => T
): T => {
  const store = useContext(MetadataStoreContext)
  if (!store) throw new Error("MetadataStoreContext not provided")
  return useStore(store, selector)
}

export const usePopoverStore = <T>(selector: (state: PopoverStore) => T): T => {
  const store = useContext(PopoverStoreContext)
  if (!store) throw new Error("PopoverStoreContext not provided")
  return useStore(store, selector)
}
