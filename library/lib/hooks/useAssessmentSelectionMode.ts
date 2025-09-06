import { useAssessmentSelectionStore, useMetadataStore } from "@/store"
import { useShallow } from "zustand/shallow"
import { ApollonMode } from "@/typings"
import { useCallback, useEffect } from "react"

export const useAssessmentSelectionMode = () => {
  const { mode, readonly } = useMetadataStore(
    useShallow((state) => ({
      mode: state.mode,
      readonly: state.readonly,
    }))
  )

  const {
    isAssessmentSelectionMode,
    setAssessmentSelectionMode,
    clearSelection,
  } = useAssessmentSelectionStore(
    useShallow((state) => ({
      isAssessmentSelectionMode: state.isAssessmentSelectionMode,
      setAssessmentSelectionMode: state.setAssessmentSelectionMode,
      clearSelection: state.clearSelection,
    }))
  )

  // Auto-enable assessment selection mode when in readonly assessment mode
  useEffect(() => {
    const shouldEnableAssessmentMode =
      mode === ApollonMode.Assessment && readonly
    if (shouldEnableAssessmentMode !== isAssessmentSelectionMode) {
      setAssessmentSelectionMode(shouldEnableAssessmentMode)
    }
  }, [mode, readonly, isAssessmentSelectionMode, setAssessmentSelectionMode])

  const onPaneClicked = useCallback(() => {
    if (isAssessmentSelectionMode) {
      clearSelection()
    }
  }, [isAssessmentSelectionMode, clearSelection])

  return { onPaneClicked }
}
