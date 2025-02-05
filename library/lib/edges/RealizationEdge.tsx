import { BaseEdge, EdgeProps, getSmoothStepPath } from "@xyflow/react"
import {
  STEP_BOARDER_RADIUS,
  TRIANGLE_MARKER_PADDING,
  SOURCE_CONNECTION_POINT_PADDING,
} from "@/constants"
import { adjustSourceCoordinates, adjustTargetCoordinates } from "@/utils"

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
  const markerPadding = TRIANGLE_MARKER_PADDING
  const sourceConnectionPointPadding = SOURCE_CONNECTION_POINT_PADDING
  const borderRadius = STEP_BOARDER_RADIUS
  const adjustedTargetCoordinates = adjustTargetCoordinates(
    targetX,
    targetY,
    targetPosition,
    markerPadding
  )
  const adjustedSourceCoordinates = adjustSourceCoordinates(
    sourceX,
    sourceY,
    sourcePosition,
    sourceConnectionPointPadding
  )

  const [edgePath] = getSmoothStepPath({
    sourceX: adjustedSourceCoordinates.sourceX,
    sourceY: adjustedSourceCoordinates.sourceY,
    sourcePosition,
    targetX: adjustedTargetCoordinates.targetX,
    targetY: adjustedTargetCoordinates.targetY,
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
