import { Controls, useReactFlow, useStore } from "@xyflow/react"
import { useDiagramStore } from "@/store/context"
import { useShallow } from "zustand/shallow"
import { UndoIcon } from "./Icon/UndoIcon"
import { RedoIcon } from "./Icon/RedoIcon"
import { Tooltip } from "@mui/material"

export const CustomControls = () => {
  const { zoomTo } = useReactFlow()
  const zoomLevel = useStore((state) => state.transform[2])
  const zoomLevelPercent = Math.round(zoomLevel * 100)

  const { canUndo, canRedo, undo, redo, undoManagerExist } = useDiagramStore(
    useShallow((state) => ({
      canUndo: state.canUndo,
      canRedo: state.canRedo,
      undo: state.undo,
      redo: state.redo,
      undoManagerExist: state.undoManager !== null,
    }))
  )

  const handleUndo = () => {
    undo()
  }

  const handleRedo = () => {
    redo()
  }

  return (
    <Controls orientation="horizontal" showInteractive={false}>
      {/* Undo Button */}
      {undoManagerExist && (
        <Tooltip title="Undo (Ctrl+Z)">
          <button
            className={`control-button ${!canUndo ? "disabled" : ""}`}
            onClick={handleUndo}
            disabled={!canUndo}
          >
            <UndoIcon
              width={16}
              height={16}
              className={canUndo ? "icon-enabled" : "icon-disabled"}
            />
          </button>
        </Tooltip>
      )}
      {/* Redo Button */}
      {undoManagerExist && (
        <Tooltip title="Redo (Ctrl+Y or Ctrl+Shift+Z)">
          <button
            className={`control-button ${!canRedo ? "disabled" : ""}`}
            onClick={handleRedo}
            disabled={!canRedo}
          >
            <RedoIcon
              width={16}
              height={16}
              className={canRedo ? "icon-enabled" : "icon-disabled"}
            />
          </button>
        </Tooltip>
      )}
      <div
        style={{
          backgroundColor: "white",
          border: "1px solid black",
          borderRadius: 8,
          paddingLeft: 1.5,
          paddingRight: 1.5,
          cursor: "pointer",
        }}
        onClick={() => zoomTo(1)}
      >
        {zoomLevelPercent}%
      </div>
    </Controls>
  )
}
