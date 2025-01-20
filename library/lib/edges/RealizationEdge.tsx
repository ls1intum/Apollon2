import { BaseEdge, EdgeProps, getSmoothStepPath } from "@xyflow/react"
import { STEP_BOARDER_RADIUS, MARKER_PADDING } from "@/constants/edgeConstants"
import { adjustEdgeCoordinates } from "@/utils"

// Realization Edge (Dotted White Triangle)
export const RealizationEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}: EdgeProps) => {
  const markerPadding = MARKER_PADDING
  const borderRadius = STEP_BOARDER_RADIUS
  const adjustedCoordinates = adjustEdgeCoordinates(
      targetX,
      targetY,
      targetPosition,
      markerPadding
    );
  // Generate the edge path
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX: adjustedCoordinates.targetX,
    targetY: adjustedCoordinates.targetY,
    targetPosition,
    borderRadius,
  })

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      markerEnd="url(#white-triangle)" // Reference the white triangle marker
      strokeDasharray="8" // Dotted line effect
      strokeWidth={4} // Line thickness
      style={{
        stroke: "#000000",
      }}
    />
  )
}
