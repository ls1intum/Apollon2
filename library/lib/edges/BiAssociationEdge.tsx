import { BaseEdge, EdgeProps, getSmoothStepPath } from "@xyflow/react"
import { STEP_BOARDER_RADIUS } from "@/constants"

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
      style={{
        zIndex: 50,
        stroke: "#000000",
      }}
    />
  )
}
