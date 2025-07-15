import { Controls, useReactFlow, useStore } from "@xyflow/react"
import { useDiagramStore } from "@/store/context"
import { useShallow } from "zustand/shallow"

export const CustomControls = () => {
  const { zoomTo } = useReactFlow()
  const zoomLevel = useStore((state) => state.transform[2])
  const zoomLevelPercent = Math.round(zoomLevel * 100)

  const { canUndo, canRedo, undo, redo } = useDiagramStore(
    useShallow((state) => ({
      canUndo: state.canUndo,
      canRedo: state.canRedo,
      undo: state.undo,
      redo: state.redo,
    }))
  )

  const handleUndo = () => {
    undo()
  }

  const handleRedo = () => {
    redo()
  }

  const buttonStyle = (enabled: boolean): React.CSSProperties => ({
    backgroundColor: "white",
    border: "1px solid black",
    borderRadius: 8,
    padding: "6px 8px",
    cursor: enabled ? "pointer" : "not-allowed",
    opacity: enabled ? 1 : 0.5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "32px",
    height: "32px",
    fontSize: "14px",
    fontWeight: "bold",
  })

  return (
    <Controls orientation="horizontal" showInteractive={false}>
      <button
        style={buttonStyle(canUndo)}
        onClick={handleUndo}
        disabled={!canUndo}
        title="Undo (Ctrl+Z)"
        onMouseEnter={(e) => {
          if (canUndo) {
            e.currentTarget.style.backgroundColor = "#f0f0f0"
          }
        }}
        onMouseLeave={(e) => {
          if (canUndo) {
            e.currentTarget.style.backgroundColor = "white"
          }
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill={canUndo ? "#000000" : "#999"}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M6,3.6V0L0,6l6,6V8c6-.27,7.53,3.76,7.88,5.77a.27.27,0,0,0,.53,0C17.08,2.86,6,3.6,6,3.6Z" />
        </svg>
      </button>

      {/* Redo Button */}
      <button
        style={buttonStyle(canRedo)}
        onClick={handleRedo}
        disabled={!canRedo}
        title="Redo (Ctrl+Y or Ctrl+Shift+Z)"
        onMouseEnter={(e) => {
          if (canRedo) {
            e.currentTarget.style.backgroundColor = "#f0f0f0"
          }
        }}
        onMouseLeave={(e) => {
          if (canRedo) {
            e.currentTarget.style.backgroundColor = "white"
          }
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill={canRedo ? "#000000" : "#999"}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16,6,10,0V3.6S-1.08,2.86,1.59,13.78a.27.27,0,0,0,.53,0c.35-2,1.9-6,7.88-5.77v4Z" />
        </svg>
      </button>
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
