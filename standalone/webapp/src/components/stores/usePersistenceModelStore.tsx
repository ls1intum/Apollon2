import { create } from "zustand"
import { UMLModel, UMLDiagramType } from "@tumaet/apollon"
import { v4 as uuidv4 } from "uuid"
import { persist, devtools } from "zustand/middleware"
import { PlaygroundDefaultModel } from "@/constants/playgroundDefaultDiagram"

type PersistentModelEntity = {
  id: string
  model: UMLModel
  lastModifiedAt: string
}

type PersistenceModelStore = {
  models: Record<string, PersistentModelEntity>
  currentModelId: string | null
  setCurrentModelId: (id: string) => void
  createModel: (title: string, type: UMLDiagramType) => string
  updateModel: (model: UMLModel) => void
  deleteModel: (id: string) => void
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
        models: {
          playgroundModelId: {
            id: "playgroundModelId",
            model: PlaygroundDefaultModel,
            lastModifiedAt: new Date().toISOString(),
          },
        },
        currentModelId: null,

        setCurrentModelId: (id) =>
          set({ currentModelId: id }, false, "setCurrentModelId"),

        createModel: (title, type) => {
          const now = new Date().toISOString()
          const model: UMLModel = {
            ...populateNewModel(),
            title,
            type,
          }

          const persistentEntity: PersistentModelEntity = {
            id: model.id,
            model,
            lastModifiedAt: now,
          }

          set(
            (state) => ({
              models: { ...state.models, [model.id]: persistentEntity },
              currentModelId: model.id,
            }),
            false,
            "createModel"
          )

          return model.id
        },

        updateModel: (model) => {
          const now = new Date().toISOString()

          set(
            (state) => {
              const old = state.models[model.id]
              if (!old) return state

              return {
                models: {
                  ...state.models,
                  [model.id]: {
                    id: model.id,
                    model,
                    lastModifiedAt: now,
                  },
                },
              }
            },
            false,
            "updateModel"
          )
        },
        deleteModel: (id) => {
          set(
            (state) => {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { [id]: _, ...rest } = state.models
              return { models: rest }
            },
            false,
            "deleteModel"
          )
        },
      }),
      {
        name: "persistenceModelStore",
      }
    ),
    {
      name: "Standalone persistenceModelStore DevTools",
    }
  )
)
