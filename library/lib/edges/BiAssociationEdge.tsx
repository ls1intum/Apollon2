import { BaseEdge, EdgeProps, getSmoothStepPath } from "@xyflow/react"

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
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
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
