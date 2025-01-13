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
        stroke: "#000000",
      }}
    />
  )
}

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
      style={{
        stroke: "#000000",
      }}
    />
  )
}

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
