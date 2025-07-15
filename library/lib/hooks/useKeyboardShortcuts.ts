import { useEffect } from "react"
import { useDiagramStore } from "@/store/context"
import { useShallow } from "zustand/shallow"

export const useKeyboardShortcuts = () => {
  const { undo, redo, canUndo, canRedo, undoManager } = useDiagramStore(
    useShallow((state) => ({
      undo: state.undo,
      redo: state.redo,
      canUndo: state.canUndo,
      canRedo: state.canRedo,
      undoManager: state.undoManager,
    }))
  )

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if Ctrl (or Cmd on Mac) is pressed
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
        default:
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    // Cleanup
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [undo, redo, canUndo, canRedo, undoManager])
}
