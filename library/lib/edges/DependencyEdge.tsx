import { BaseEdge, EdgeProps, getSmoothStepPath } from "@xyflow/react"

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
      markerEnd="url(#custom-arrow)"
      strokeDasharray="8"
      strokeWidth={4}
      style={{
        stroke: "#000000",
      }}
    />
  )
}
