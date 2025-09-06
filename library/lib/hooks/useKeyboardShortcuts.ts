import { useEffect, useRef } from "react"
import { useDiagramStore } from "@/store/context"
import { useShallow } from "zustand/shallow"

export const useKeyboardShortcuts = () => {
  // Track paste count for progressive offset
  const pasteCountRef = useRef(0)
  
  const { 
    undo, 
    redo, 
    canUndo, 
    canRedo, 
    undoManager,
    copySelectedElements,
    pasteElements,
    selectedElementIds
  } = useDiagramStore(
    useShallow((state) => ({
      undo: state.undo,
      redo: state.redo,
      canUndo: state.canUndo,
      canRedo: state.canRedo,
      undoManager: state.undoManager,
      copySelectedElements: state.copySelectedElements,
      pasteElements: state.pasteElements,
      hasSelectedElements: state.hasSelectedElements,
      selectedElementIds: state.selectedElementIds,
    }))
  )

  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      // Check if we're in an input field or textarea
      const target = event.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return
      }

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
        case "c":
          if (!event.shiftKey && !event.altKey) {
            event.preventDefault()
            if (selectedElementIds.length > 0) {
              // Reset paste count when copying new elements
              pasteCountRef.current = 0
              const success = await copySelectedElements()
              if (success) {
                console.log('Elements copied to clipboard')
              }
            }
          }
          break
        case "v":
          if (!event.shiftKey && !event.altKey) {
            event.preventDefault()
            // Increment paste count for progressive offset
            pasteCountRef.current += 1
            const success = await pasteElements(pasteCountRef.current)
            if (success) {
              console.log('Elements pasted from clipboard')
            }
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
  }, [undo, redo, canUndo, canRedo, undoManager, copySelectedElements, pasteElements, selectedElementIds])
}