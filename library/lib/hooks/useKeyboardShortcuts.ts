import { useEffect, useRef } from "react"
import { useDiagramStore } from "@/store/context"
import { useShallow } from "zustand/shallow"

export const useKeyboardShortcuts = () => {
  const pasteCountRef = useRef(0)

  const {
    undo,
    redo,
    canUndo,
    canRedo,
    undoManager,
    copySelectedElements,
    pasteElements,
    selectedElementIds,
    selectAll,
    clearSelection,
  } = useDiagramStore(
    useShallow((state) => ({
      undo: state.undo,
      redo: state.redo,
      canUndo: state.canUndo,
      canRedo: state.canRedo,
      undoManager: state.undoManager,
      copySelectedElements: state.copySelectedElements,
      pasteElements: state.pasteElements,
      selectedElementIds: state.selectedElementIds,
      selectAll: state.selectAll,
      clearSelection: state.clearSelection,
    }))
  )

  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      // Check if we're in an input field or textarea
      const target = event.target as HTMLElement
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return
      }
      if (event.key === "Escape") {
        event.preventDefault()
        clearSelection()
        return
      }

      // Check if Ctrl (or Cmd on Mac) is pressed for other shortcuts
      const isModifierPressed = event.ctrlKey || event.metaKey

      if (!isModifierPressed) return

      switch (event.key.toLowerCase()) {
        case "z":
          event.preventDefault()
          if (event.shiftKey) {
            redo()
          } else {
            undo()
          }
          break

        case "y":
          if (!event.shiftKey) {
            event.preventDefault()
            redo()
          }
          break

        case "a":
          if (!event.shiftKey && !event.altKey) {
            event.preventDefault()
            selectAll()
          }
          break

        case "c":
          if (!event.shiftKey && !event.altKey) {
            event.preventDefault()
            if (selectedElementIds.length > 0) {
              pasteCountRef.current = 0
              copySelectedElements()
            }
          }
          break

        case "v":
          if (!event.shiftKey && !event.altKey) {
            event.preventDefault()
            pasteCountRef.current += 1
            pasteElements(pasteCountRef.current)
          }
          break

        case "d":
          if (!event.shiftKey && !event.altKey) {
            event.preventDefault()
            clearSelection()
          }
          break

        default:
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [
    undo,
    redo,
    canUndo,
    canRedo,
    undoManager,
    copySelectedElements,
    pasteElements,
    selectedElementIds,
    selectAll,
    clearSelection,
  ])
}
