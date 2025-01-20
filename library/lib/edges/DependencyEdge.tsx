import { BaseEdge, EdgeProps, getSmoothStepPath } from "@xyflow/react"
import { MARKER_PADDING, STEP_BOARDER_RADIUS } from "@/constants/edgeConstants"
import { adjustEdgeCoordinates } from "@/utils"
// Dependency Edge (Dotted White Arrow)
export const DependencyEdge = ({
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
  )

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
      markerEnd="url(#black-arrow)" // Reference the black arrow marker
      strokeDasharray="6" // Dotted line effect
      strokeWidth={4} // Line thickness
      style={{
        stroke: "#000000",
      }}
    />
  )
}
