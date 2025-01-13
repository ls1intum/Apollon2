import { BaseEdge, EdgeProps, getSmoothStepPath } from "@xyflow/react"
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
      markerEnd="url(#white-triangle)"
      strokeDasharray="8"
      strokeWidth={4}
      style={{
        stroke: "#000000",
      }}
    />
  )
}
