import { create, StoreApi, UseBoundStore } from "zustand"
import { devtools, subscribeWithSelector } from "zustand/middleware"
import { diagramMetadata } from "./constants"
import { parseDiagramType } from "@/utils"
import ydoc from "@/sync/ydoc"
import { DiagramType } from "@/types"

export type MetadataStore = {
  diagramName: string
  diagramType: DiagramType
  updateDiagramName: (name: string) => void
  updateDiagramType: (type: DiagramType) => void
  updateMetaData: (name: string, type: DiagramType) => void
  updateMetaDataFromYjs: () => void
}

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

        updateMetaData: (name, type) => {
          ydoc.transact(() => {
            diagramMetadata.set("diagramName", name)
            diagramMetadata.set("diagramType", type)
          }, "store")
          set(
            {
              diagramName: name,
              diagramType: type,
            },
            undefined,
            "updateMetaData"
          )
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
