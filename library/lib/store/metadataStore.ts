import { create, StoreApi, UseBoundStore } from "zustand"
import { devtools, subscribeWithSelector } from "zustand/middleware"
import { parseDiagramType } from "@/utils"
import * as Y from "yjs"
import { getDiagramMetadata } from "@/sync/ydoc"
import { DiagramType } from "@/types"

export type MetadataStore = {
  diagramTitle: string
  diagramType: DiagramType
  updateDiagramTitle: (diagramTitle: string) => void
  updateDiagramType: (diagramType: DiagramType) => void
  updateMetaData: (diagramTitle: string, diagramType: DiagramType) => void
  updateMetaDataFromYjs: () => void
  reset: () => void
}

type InitialMetadataState = {
  diagramTitle: string
  diagramType: DiagramType
}
const initialMetadataState: InitialMetadataState = {
  diagramTitle: "Untitled Diagram",
  diagramType: DiagramType.ClassDiagram,
}

export const createMetadataStore = (
  ydoc: Y.Doc
): UseBoundStore<StoreApi<MetadataStore>> =>
  create<MetadataStore>()(
    devtools(
      subscribeWithSelector((set) => ({
        ...initialMetadataState,

        updateDiagramTitle: (diagramTitle) => {
          ydoc.transact(() => {
            getDiagramMetadata(ydoc).set("diagramTitle", diagramTitle)
          }, "store")
          set({ diagramTitle }, undefined, "updateDiagramTitle")
        },

        updateDiagramType: (type) => {
          ydoc.transact(() => {
            getDiagramMetadata(ydoc).set("diagramType", type)
          }, "store")
          set({ diagramType: type }, undefined, "updateDiagramType")
        },

        updateMetaData: (diagramTitle, diagramType) => {
          ydoc.transact(() => {
            getDiagramMetadata(ydoc).set("diagramTitle", diagramTitle)
            getDiagramMetadata(ydoc).set("diagramType", diagramType)
          }, "store")
          set(
            {
              diagramTitle,
              diagramType,
            },
            undefined,
            "updateMetaData"
          )
        },

        updateMetaDataFromYjs: () =>
          set(
            {
              diagramTitle:
                getDiagramMetadata(ydoc).get("diagramTitle") ||
                "Untitled Diagram",
              diagramType: parseDiagramType(
                getDiagramMetadata(ydoc).get("diagramType")
              ),
            },
            undefined,
            "updateMetaDataFromYjs"
          ),

        reset: () => {
          set(initialMetadataState, undefined, "reset")
        },
      })),
      { name: "MetadataStore", enabled: true }
    )
  )
