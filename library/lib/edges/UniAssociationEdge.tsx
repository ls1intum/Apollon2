import { BaseEdge, EdgeProps, getSmoothStepPath } from "@xyflow/react"
import { MARKER_PADDING, STEP_BOARDER_RADIUS } from "@/constants/edgeConstants"
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
  const markerPadding = MARKER_PADDING
  const borderRadius = STEP_BOARDER_RADIUS

  // Adjust coordinates based on connection positions
  if (targetPosition === "left") {
    targetX -= markerPadding
  } else if (targetPosition === "right") {
    targetX += markerPadding
  } else if (targetPosition === "top") {
    targetY -= markerPadding
  } else if (targetPosition === "bottom") {
    targetY += markerPadding
  }

  // Generate the edge path
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
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
