import { StraightPathEdge, StraightPathEdgeData } from "../pathTypes/StraightPathEdge"
import { EdgeMiddleLabels } from "../labelTypes/EdgeMiddleLabels"
import { BaseEdgeProps } from "../GenericEdge"

interface UseCaseEdgeProps extends BaseEdgeProps {
  showRelationshipLabels?: boolean
}

export const UseCaseEdge = ({
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
  showRelationshipLabels = false,
}: UseCaseEdgeProps) => {
  // Determine relationship type for labels
  const relationshipType = type === "UseCaseInclude" ? "include" : 
                          type === "UseCaseExtend" ? "extend" : 
                          undefined

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
    >
      {(edgeData: StraightPathEdgeData) => (
        <EdgeMiddleLabels
          label={data?.label}
          pathMiddlePosition={edgeData.pathMiddlePosition}
          isMiddlePathHorizontal={edgeData.isMiddlePathHorizontal}
          sourcePoint={edgeData.sourcePoint}
          targetPoint={edgeData.targetPoint}
          isUseCasePath={true}
          showRelationshipLabels={showRelationshipLabels}
          relationshipType={relationshipType}
        />
      )}
    </StraightPathEdge>
  )
}