import { BaseEdge, EdgeProps, getSmoothStepPath } from "@xyflow/react"
import { STEP_BOARDER_RADIUS, MARKER_PADDING } from "@/constants/edgeConstants"
import { adjustEdgeCoordinates } from "@/utils"
// Aggregation Edge (White Rhombus)
export const AggregationEdge = ({
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
      markerEnd="url(#white-rhombus)"
      style={{
        stroke: "#000000",
      }}
    />
  )
}
