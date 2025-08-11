import { StepPathEdge, StepPathEdgeData } from "../pathTypes/StepPathEdge"
import { EdgeMiddleLabels } from "../labelTypes/EdgeMiddleLabels"
import { BaseEdgeProps } from "../GenericEdge"

interface ActivityDiagramEdgeProps extends BaseEdgeProps {
  allowMidpointDragging?: boolean
  enableReconnection?: boolean
}

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
  allowMidpointDragging = true,
  enableReconnection = true,
}: ActivityDiagramEdgeProps) => {
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
    >
      {(edgeData: StepPathEdgeData) => (
        <>
          {/* Activity diagrams typically only use middle labels, not end labels */}
          <EdgeMiddleLabels
            label={data?.label}
            pathMiddlePosition={edgeData.pathMiddlePosition}
            isMiddlePathHorizontal={edgeData.isMiddlePathHorizontal}
            isUseCasePath={false}
          />
        </>
      )}
    </StepPathEdge>
  )
}
