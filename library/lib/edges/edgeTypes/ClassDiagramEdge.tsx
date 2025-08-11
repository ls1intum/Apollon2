import { StepPathEdge, StepPathEdgeData } from "../pathTypes/StepPathEdge"
import { EdgeEndLabels } from "../labelTypes/EdgeEndLabels"
import { EdgeMiddleLabels } from "../labelTypes/EdgeMiddleLabels"
import { BaseEdgeProps } from "../GenericEdge"

interface ClassDiagramEdgeProps extends BaseEdgeProps {
  allowMidpointDragging?: boolean
  enableReconnection?: boolean
}

export const ClassDiagramEdge = ({
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
}: ClassDiagramEdgeProps) => {
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
          {/* Class diagrams use both end labels (roles/multiplicities) and middle labels */}
          <EdgeEndLabels
            data={data}
            activePoints={edgeData.activePoints}
            sourceX={sourceX}
            sourceY={sourceY}
            targetX={targetX}
            targetY={targetY}
            sourcePosition={sourcePosition}
            targetPosition={targetPosition}
          />

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
