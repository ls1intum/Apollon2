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
    console.log("🔧 Keyboard shortcuts hook initialized")
    console.log("📊 Undo Manager:", undoManager)
    console.log("↶ Can Undo:", canUndo, "↷ Can Redo:", canRedo)

    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if Ctrl (or Cmd on Mac) is pressed
      const isModifierPressed = event.ctrlKey || event.metaKey
      
      console.log("⌨️ Key pressed:", {
        key: event.key,
        ctrlKey: event.ctrlKey,
        metaKey: event.metaKey,
        shiftKey: event.shiftKey,
        isModifierPressed
      })
      
      if (!isModifierPressed) return

      switch (event.key.toLowerCase()) {
        case 'z':
          console.log("🎯 Z key detected")
          event.preventDefault()
          if (event.shiftKey) {
            console.log("↷ Attempting redo (Ctrl+Shift+Z)")
            redo()
          } else {
            console.log("↶ Attempting undo (Ctrl+Z)")
            undo()
          }
          break
        case 'y':
          console.log("🎯 Y key detected")
          if (!event.shiftKey) {
            event.preventDefault()
            console.log("↷ Attempting redo (Ctrl+Y)")
            redo()
          }
          break
        default:
          break
      }
    }

    // Add event listener
    document.addEventListener('keydown', handleKeyDown)
    console.log("👂 Event listener added")

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      console.log("🧹 Event listener removed")
    }
  }, [undo, redo, canUndo, canRedo, undoManager])
}

// Debug version of useUndoRedo
export const useUndoRedo = () => {
  const state = useDiagramStore(
    useShallow((state) => ({
      canUndo: state.canUndo,
      canRedo: state.canRedo,
      undo: state.undo,
      redo: state.redo,
      undoManager: state.undoManager,
    }))
  )
  
  useEffect(() => {
    console.log("🔍 UndoRedo state:", state)
  }, [state])
  
  return state
}