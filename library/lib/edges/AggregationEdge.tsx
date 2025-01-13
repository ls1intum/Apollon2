import { BaseEdge, EdgeProps, getSmoothStepPath } from "@xyflow/react"

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
      markerEnd="url(#white-rhombus)"
      style={{
        stroke: "#000000",
      }}
    />
  )
}
