import { BaseEdge, EdgeProps, getSmoothStepPath } from "@xyflow/react"

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
      markerEnd="url(#black-rhombus)"
      style={{
        stroke: "#000000",
      }}
    />
  )
}
