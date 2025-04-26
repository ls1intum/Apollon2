import { create, StoreApi, UseBoundStore } from "zustand"
import { devtools, subscribeWithSelector } from "zustand/middleware"
import { parseDiagramType } from "@/utils"
import * as Y from "yjs"
import { getDiagramMetadata } from "@/sync/ydoc"
import { DiagramType } from "@/types"

export type MetadataStore = {
  diagramName: string
  diagramType: DiagramType
  updateDiagramName: (name: string) => void
  updateDiagramType: (type: DiagramType) => void
  updateMetaData: (name: string, type: DiagramType) => void
  updateMetaDataFromYjs: () => void
  reset: () => void
}

type InitialMetadataState = {
  diagramName: string
  diagramType: DiagramType
}
const initialMetadataState: InitialMetadataState = {
  diagramName: "Untitled Diagram",
  diagramType: DiagramType.ClassDiagram,
}

export const createMetadataStore = (
  ydoc: Y.Doc
): UseBoundStore<StoreApi<MetadataStore>> =>
  create<MetadataStore>()(
    devtools(
      subscribeWithSelector((set) => ({
        ...initialMetadataState,

        updateDiagramName: (name) => {
          ydoc.transact(() => {
            getDiagramMetadata(ydoc).set("diagramName", name)
          }, "store")
          set({ diagramName: name }, undefined, "updateDiagramName")
        },

        updateDiagramType: (type) => {
          ydoc.transact(() => {
            getDiagramMetadata(ydoc).set("diagramType", type)
          }, "store")
          set({ diagramType: type }, undefined, "updateDiagramType")
        },

        updateMetaData: (name, type) => {
          ydoc.transact(() => {
            getDiagramMetadata(ydoc).set("diagramName", name)
            getDiagramMetadata(ydoc).set("diagramType", type)
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
                getDiagramMetadata(ydoc).get("diagramName") ||
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
