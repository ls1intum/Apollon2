import { BaseEdge, EdgeProps, getSmoothStepPath } from "@xyflow/react"
import {
  STEP_BOARDER_RADIUS,
  SOURCE_CONNECTION_POINT_PADDING,
} from "@/constants"
import { adjustSourceCoordinates } from "@/utils"
// Uni-Directional Association Edge (Black Arrow)
export const BiAssociationEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}: EdgeProps) => {
  const borderRadius = STEP_BOARDER_RADIUS
  const sourceConnectionPointPadding = SOURCE_CONNECTION_POINT_PADDING

  const adjustedSourceCoordinates = adjustSourceCoordinates(
    sourceX,
    sourceY,
    sourcePosition,
    sourceConnectionPointPadding
  )
  const adjustedTargetCoordinates = adjustSourceCoordinates(
    targetX,
    targetY,
    targetPosition,
    sourceConnectionPointPadding
  )

  const [edgePath] = getSmoothStepPath({
    sourceX: adjustedSourceCoordinates.sourceX,
    sourceY: adjustedSourceCoordinates.sourceY,
    sourcePosition,
    targetX: adjustedTargetCoordinates.sourceX,
    targetY: adjustedTargetCoordinates.sourceY,
    targetPosition,
    borderRadius,
  })
  return (
    <BaseEdge
      id={id}
      path={edgePath}
      style={{
        zIndex: 50,
        stroke: "#000000",
      }}
    />
  )
}
