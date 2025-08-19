import { StraightPathEdge } from "../pathTypes/StraightPathEdge"
import { BaseEdgeProps } from "../GenericEdge"

interface SyntaxTreeEdgeProps extends BaseEdgeProps {
  showRelationshipLabels?: boolean
}

export const SyntaxTreeEdge = ({
  id,
  type,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  sourceHandleId,
  targetHandleId,
  data,
}: SyntaxTreeEdgeProps) => {
  return (
    <StraightPathEdge
      id={id}
      type={type}
      source={source}
      target={target}
      sourceX={sourceX}
      sourceY={sourceY}
      targetX={targetX}
      targetY={targetY}
      sourcePosition={sourcePosition}
      targetPosition={targetPosition}
      sourceHandleId={sourceHandleId}
      targetHandleId={targetHandleId}
      data={data}
    ></StraightPathEdge>
  )
}
