import { create, StoreApi, UseBoundStore } from "zustand"
import { devtools } from "zustand/middleware"

export type AssessmentSelectionStore = {
  // Currently selected elements for assessment
  selectedElementIds: string[]
  // Highlighted element (on hover)
  highlightedElementId: string | null
  // Whether assessment selection mode is active
  isAssessmentSelectionMode: boolean

  // Actions
  setAssessmentSelectionMode: (isActive: boolean) => void
  selectElement: (elementId: string) => void
  selectMultipleElements: (elementIds: string[]) => void
  clearSelection: () => void
  setHighlightedElement: (elementId: string | null) => void
  isElementSelected: (elementId: string) => boolean
  isElementHighlighted: (elementId: string) => boolean
  reset: () => void
}

type InitialAssessmentSelectionState = {
  selectedElementIds: string[]
  highlightedElementId: string | null
  isAssessmentSelectionMode: boolean
}

const initialAssessmentSelectionState: InitialAssessmentSelectionState = {
  selectedElementIds: [],
  highlightedElementId: null,
  isAssessmentSelectionMode: false,
}

export const createAssessmentSelectionStore = (): UseBoundStore<
  StoreApi<AssessmentSelectionStore>
> =>
  create<AssessmentSelectionStore>()(
    devtools(
      (set, get) => ({
        ...initialAssessmentSelectionState,

        setAssessmentSelectionMode: (isActive: boolean) => {
          set(
            { isAssessmentSelectionMode: isActive },
            undefined,
            "setAssessmentSelectionMode"
          )
          // Clear selection when disabling assessment mode
          if (!isActive) {
            set(
              { selectedElementIds: [], highlightedElementId: null },
              undefined,
              "clearSelectionOnDisable"
            )
          }
        },

        selectElement: (elementId: string) => {
          set({ selectedElementIds: [elementId] }, undefined, "selectElement")
        },

        selectMultipleElements: (elementIds: string[]) => {
          set(
            { selectedElementIds: elementIds },
            undefined,
            "selectMultipleElements"
          )
        },

        clearSelection: () => {
          set({ selectedElementIds: [] }, undefined, "clearSelection")
        },

        setHighlightedElement: (elementId: string | null) => {
          set(
            { highlightedElementId: elementId },
            undefined,
            "setHighlightedElement"
          )
        },

        isElementSelected: (elementId: string) => {
          return get().selectedElementIds.includes(elementId)
        },

        isElementHighlighted: (elementId: string) => {
          return get().highlightedElementId === elementId
        },

        reset: () => {
          set(initialAssessmentSelectionState, undefined, "reset")
        },
      }),
      { name: "AssessmentSelectionStore", enabled: true }
    )
  )
