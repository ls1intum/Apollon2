import { BaseEdge, EdgeProps, getSmoothStepPath } from "@xyflow/react"
import {
  STEP_BOARDER_RADIUS,
  RHOMBUS_MARKER_PADDING,
  SOURCE_CONNECTION_POINT_PADDING,
} from "@/constants"
import { adjustSourceCoordinates, adjustTargetCoordinates } from "@/utils"

// Composition Edge (Black Rhombus)
export const CompositionEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}: EdgeProps) => {
  const markerPadding = RHOMBUS_MARKER_PADDING
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
      markerEnd="url(#black-rhombus)" // Reference the black rhombus marker
      style={{
        stroke: "#000000",
      }}
    />
  )
}
