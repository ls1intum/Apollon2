import { StepPathEdge, StepPathEdgeData } from "../pathTypes/StepPathEdge"
import { EdgeMiddleLabels } from "../labelTypes/EdgeMiddleLabels"
import { BaseEdgeProps } from "../GenericEdge"

interface FlowChartEdgeProps extends BaseEdgeProps {
  allowMidpointDragging?: boolean
  enableReconnection?: boolean
  enableStraightPath?: boolean
}

export const FlowChartEdge = ({
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
  allowMidpointDragging = true,
  enableReconnection = true,
  enableStraightPath = false,
}: FlowChartEdgeProps) => {
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
      enableReconnection={enableReconnection}
      enableStraightPath={enableStraightPath}
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
