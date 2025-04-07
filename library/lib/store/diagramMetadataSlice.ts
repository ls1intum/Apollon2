import { StateCreator } from "zustand"
import { diagramMetadata } from "."
import { DiagramType } from "@/types"
import { parseDiagramType } from "@/utils"

export interface DiagramMetadataSlice {
  diagramName: string
  diagramType: DiagramType
  updateDiagramName: (name: string) => void
  updateDiagramType: (type: DiagramType) => void
}

export const createDiagramMetadataSlice: StateCreator<
  DiagramMetadataSlice
> = () => ({
  diagramName: diagramMetadata.get("diagramName") || "Untitled Diagram",
  diagramType: parseDiagramType(diagramMetadata.get("diagramType")),

  updateDiagramName: (name) => {
    diagramMetadata.set("diagramName", name)
  },
  updateDiagramType: (type) => {
    diagramMetadata.set("diagramType", type)
  },
})
