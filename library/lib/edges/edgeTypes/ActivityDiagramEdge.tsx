import { StepPathEdge, StepPathEdgeData } from "../pathTypes/StepPathEdge"
import { EdgeMiddleLabels } from "../labelTypes/EdgeMiddleLabels"
import { BaseEdgeProps } from "../GenericEdge"
import { useEdgeConfig } from "@/hooks/useEdgeConfig"

export const ActivityDiagramEdge = ({
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
}: BaseEdgeProps) => {
  const config = useEdgeConfig(type as "ActivityControlFlow")

  const allowMidpointDragging =
    "allowMidpointDragging" in config ? config.allowMidpointDragging : true

  return (
    <StepPathEdge
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
      allowMidpointDragging={allowMidpointDragging}
      enableReconnection={true}
      enableStraightPath={false}
    >
      {(edgeData: StepPathEdgeData) => (
        <EdgeMiddleLabels
          label={data?.label}
          pathMiddlePosition={edgeData.pathMiddlePosition}
          isMiddlePathHorizontal={edgeData.isMiddlePathHorizontal}
          showRelationshipLabels={true}
        />
      )}
    </StepPathEdge>
  )
}
