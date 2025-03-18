import { StateCreator } from "zustand"
import { diagramMetadata } from "."
import { DiagramType } from "@/types"

export interface DiagramMetadataSlice {
  diagramName: string
  diagramType: string
  updateDiagramName: (name: string) => void
  updateDiagramType: (type: string) => void
}

export const createDiagramMetadataSlice: StateCreator<
  DiagramMetadataSlice
> = () => ({
  diagramName: diagramMetadata.get("diagramName") || "default diagram",
  diagramType: diagramMetadata.get("diagramType") || DiagramType.ClassDiagram,

  updateDiagramName: (name) => {
    diagramMetadata.set("diagramName", name)
  },
  updateDiagramType: (type) => {
    diagramMetadata.set("diagramType", type)
  },
})
