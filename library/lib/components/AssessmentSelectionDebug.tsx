import { useAssessmentSelectionStore, useMetadataStore } from "../store/context"
import { useShallow } from "zustand/shallow"

export function AssessmentSelectionDebug() {
  const debug = useMetadataStore(useShallow((state) => state.debug))
  const {
    selectedElementIds,
    highlightedElementId,
    isAssessmentSelectionMode,
  } = useAssessmentSelectionStore(
    useShallow((state) => ({
      selectedElementIds: state.selectedElementIds,
      highlightedElementId: state.highlightedElementId,
      isAssessmentSelectionMode: state.isAssessmentSelectionMode,
    }))
  )

  if (!isAssessmentSelectionMode || !debug) {
    return null
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 10,
        right: 10,
        background: "rgba(255, 255, 255, 0.9)",
        border: "1px solid #ccc",
        borderRadius: "4px",
        padding: "10px",
        fontSize: "12px",
        fontFamily: "monospace",
        zIndex: 1000,
        maxWidth: "300px",
      }}
    >
      <div>
        <strong>Assessment Selection Debug</strong>
      </div>
      <div>Mode: {isAssessmentSelectionMode ? "ON" : "OFF"}</div>
      <div>Highlighted: {highlightedElementId || "none"}</div>
      <div>Selected ({selectedElementIds.length}):</div>
      {selectedElementIds.length > 0 ? (
        <ul style={{ margin: "5px 0", paddingLeft: "15px" }}>
          {Array.from(selectedElementIds).map((id) => (
            <li key={id}>{id}</li>
          ))}
        </ul>
      ) : (
        <div style={{ fontStyle: "italic", color: "#666" }}>
          No elements selected
        </div>
      )}
    </div>
  )
}
