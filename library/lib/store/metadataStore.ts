import { create, StoreApi, UseBoundStore } from "zustand"
import { devtools, subscribeWithSelector } from "zustand/middleware"
import { parseDiagramType } from "@/utils"
import { getDiagramMetadata, getYDoc } from "@/sync/ydoc"
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
        diagramName:
          getDiagramMetadata().get("diagramName") || "Untitled Diagram",
        diagramType: parseDiagramType(getDiagramMetadata().get("diagramType")),

        updateDiagramName: (name) => {
          getYDoc().transact(() => {
            getDiagramMetadata().set("diagramName", name)
          }, "store")
          set({ diagramName: name }, undefined, "updateDiagramName")
        },

        updateDiagramType: (type) => {
          getYDoc().transact(() => {
            getDiagramMetadata().set("diagramType", type)
          }, "store")
          set({ diagramType: type }, undefined, "updateDiagramType")
        },

        updateMetaData: (name, type) => {
          getYDoc().transact(() => {
            getDiagramMetadata().set("diagramName", name)
            getDiagramMetadata().set("diagramType", type)
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
                getDiagramMetadata().get("diagramName") || "Untitled Diagram",
              diagramType: parseDiagramType(
                getDiagramMetadata().get("diagramType")
              ),
            },
            undefined,
            "updateMetaDataFromYjs"
          ),
      })),
      { name: "MetadataStore", enabled: true }
    )
  )
