import { BaseEdge } from "@xyflow/react"
import { BaseEdgeProps, CommonEdgeElements } from "../GenericEdge"
import { EdgeMultipleLabels } from "../labelTypes/EdgeMultipleLabels"
import { useStraightPathEdge } from "@/hooks/useStraightPathEdge"
import { useDiagramStore, usePopoverStore } from "@/store/context"
import { useShallow } from "zustand/shallow"
import { useToolbar } from "@/hooks"
import { useRef } from "react"
import { EDGE_HIGHTLIGHT_STROKE_WIDTH } from "@/constants"

export const CommunicationDiagramEdge = ({
  id,
  type,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: BaseEdgeProps) => {
  const anchorRef = useRef<SVGSVGElement | null>(null)
  const { handleDelete } = useToolbar({ id })

  const { assessments } = useDiagramStore(
    useShallow((state) => ({
      assessments: state.assessments,
    }))
  )

  const setPopOverElementId = usePopoverStore(
    useShallow((state) => state.setPopOverElementId)
  )

  const {
    pathRef,
    edgeData,
    currentPath,
    overlayPath,
    markerEnd,
    strokeDashArray,
    isDiagramModifiable,
  } = useStraightPathEdge({
    type,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  })

  return (
    <>
      <g className="edge-container">
        <BaseEdge
          id={id}
          path={currentPath}
          markerEnd={markerEnd}
          pointerEvents="none"
          style={{
            stroke: "black",
            strokeDasharray: strokeDashArray,
            opacity: 1,
          }}
        />

        <path
          ref={pathRef}
          className="edge-overlay"
          d={overlayPath}
          fill="none"
          strokeWidth={EDGE_HIGHTLIGHT_STROKE_WIDTH}
          pointerEvents="stroke"
          style={{
            opacity: 0.4,
          }}
        />
      </g>

      <EdgeMultipleLabels
        labels={data?.labels || []}
        pathMiddlePosition={edgeData.pathMiddlePosition}
        isMiddlePathHorizontal={edgeData.isMiddlePathHorizontal}
        sourcePoint={edgeData.sourcePoint}
        targetPoint={edgeData.targetPoint}
        showRelationshipLabels={true}
      />

      <CommonEdgeElements
        id={id}
        pathMiddlePosition={edgeData.pathMiddlePosition}
        isDiagramModifiable={isDiagramModifiable}
        assessments={assessments}
        anchorRef={anchorRef}
        handleDelete={handleDelete}
        setPopOverElementId={setPopOverElementId}
        type={type}
      />
    </>
  )
}
