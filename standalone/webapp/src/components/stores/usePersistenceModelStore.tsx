import { create } from "zustand"
import { UMLModel, UMLDiagramType } from "@apollon2/library"
import { v4 as uuidv4 } from "uuid"
import { persist, devtools } from "zustand/middleware"

type PersistenceModelStore = {
  models: Record<string, UMLModel>
  currentModelId: string | null
  setCurrentModelId: (id: string) => void
  createModel: (title: string, type: UMLDiagramType) => string
  updateModel: (model: UMLModel) => void
}

const populateNewModel = () => ({
  id: uuidv4(),
  type: UMLDiagramType.ClassDiagram,
  assessments: {},
  edges: [],
  nodes: [],
  title: "",
  version: "4.0.0" as const,
})

export const usePersistenceModelStore = create<PersistenceModelStore>()(
  devtools(
    persist(
      (set) => ({
        models: {},
        currentModelId: null,
        setCurrentModelId: (id) =>
          set(
            { currentModelId: id },
            undefined,
            "local persistence setCurrentModelId"
          ),
        createModel: (title, type) => {
          const model: UMLModel = {
            ...populateNewModel(),
            title,
            type,
          }
          set(
            (state) => ({
              models: { ...state.models, [model.id]: model },
              currentModelId: model.id,
            }),
            undefined,
            "local persistence createModel"
          )
          return model.id
        },
        updateModel: (model) => {
          set(
            (state) => ({
              models: { ...state.models, [model.id]: model },
            }),
            undefined,
            "local persistence updateModel"
          )
        },
      }),
      { name: "persistenceModelStore" }
    ),
    {
      name: "Standalone persistenceModelStore DevTools",
    }
  )
)
