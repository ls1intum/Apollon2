import { create, StoreApi, UseBoundStore } from "zustand"
import { devtools, subscribeWithSelector } from "zustand/middleware"
import { parseDiagramType } from "@/utils"
import * as Y from "yjs"
import { getDiagramMetadata } from "@/sync/ydoc"
import { UMLDiagramType } from "@/types"
import { ApollonMode } from "@/typings"

export type MetadataStore = {
  diagramTitle: string
  diagramType: UMLDiagramType
  mode: ApollonMode
  readonly: boolean
  debug: boolean
  scrollProtection: boolean
  setMode: (mode: ApollonMode) => void
  setReadonly: (readonly: boolean) => void
  updateDiagramTitle: (diagramTitle: string) => void
  updateDiagramType: (diagramType: UMLDiagramType) => void
  updateMetaData: (diagramTitle: string, diagramType: UMLDiagramType) => void
  updateMetaDataFromYjs: () => void
  reset: () => void
  setDebug: (debug: boolean) => void
  setScrollProtection: (scrollProtection: boolean) => void
}

type InitialMetadataState = {
  diagramTitle: string
  diagramType: UMLDiagramType
  mode: ApollonMode
  readonly: boolean
  debug: boolean
  scrollProtection: boolean
}
const initialMetadataState: InitialMetadataState = {
  diagramTitle: "Untitled Diagram",
  diagramType: UMLDiagramType.ClassDiagram,
  mode: ApollonMode.Modelling,
  readonly: false,
  debug: false,
  scrollProtection: false,
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

        setMode: (mode) => {
          set({ mode }, undefined, "setMode")
        },

        setReadonly: (readonly) => {
          set({ readonly }, undefined, "setReadonly")
        },

        setDebug: (debug) => {
          set({ debug }, undefined, "setDebug")
        },

        setScrollProtection: (scrollProtection) => {
          set({ scrollProtection }, undefined, "setScrollProtection")
        },

        reset: () => {
          set(initialMetadataState, undefined, "reset")
        },
      })),
      { name: "MetadataStore", enabled: true }
    )
  )
