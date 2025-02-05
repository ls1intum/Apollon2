import { BaseEdge, EdgeProps, getSmoothStepPath } from "@xyflow/react"
import {
  ARROW_MARKER_PADDING,
  STEP_BOARDER_RADIUS,
  SOURCE_CONNECTION_POINT_PADDING,
} from "@/constants"
import { adjustSourceCoordinates, adjustTargetCoordinates } from "@/utils"
// Uni-Directional Association Edge (Black Arrow)
export const UniAssociationEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}: EdgeProps) => {
  const markerPadding = ARROW_MARKER_PADDING
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
      markerEnd="url(#black-arrow)" // Reference the black arrow marker
      style={{
        stroke: "#000000",
      }}
    />
  )
}
