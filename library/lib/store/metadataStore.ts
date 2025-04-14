import { create, StoreApi, UseBoundStore } from "zustand"
import { devtools, subscribeWithSelector } from "zustand/middleware"
import { diagramMetadata } from "./constants"
import { MetadataStore } from "./types"
import { parseDiagramType } from "@/utils"
import ydoc from "@/sync/ydoc"

export const createMetadataStore = (): UseBoundStore<StoreApi<MetadataStore>> =>
  create<MetadataStore>()(
    devtools(
      subscribeWithSelector((set) => ({
        diagramName: diagramMetadata.get("diagramName") || "Untitled Diagram",
        diagramType: parseDiagramType(diagramMetadata.get("diagramType")),

        updateDiagramName: (name) => {
          ydoc.transact(() => {
            diagramMetadata.set("diagramName", name)
          }, "store")
          set({ diagramName: name }, undefined, "updateDiagramName")
        },

        updateDiagramType: (type) => {
          ydoc.transact(() => {
            diagramMetadata.set("diagramType", type)
          }, "store")
          set({ diagramType: type }, undefined, "updateDiagramType")
        },

        updateMetaDataFromYjs: () =>
          set(
            {
              diagramName:
                diagramMetadata.get("diagramName") || "Untitled Diagram",
              diagramType: parseDiagramType(diagramMetadata.get("diagramType")),
            },
            undefined,
            "updateMetaDataFromYjs"
          ),
      })),
      { name: "MetadataStore", enabled: true }
    )
  )
