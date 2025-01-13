import { BaseEdge, EdgeProps, getSmoothStepPath } from "@xyflow/react"

// Inheritance Edge (White Triangle)
export const InheritanceEdge = ({
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
      style={{
        stroke: "#000000",
      }}
    />
  )
}