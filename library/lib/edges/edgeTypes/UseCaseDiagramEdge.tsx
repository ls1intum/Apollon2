import { BaseEdge } from "@xyflow/react"
import { BaseEdgeProps, CommonEdgeElements } from "../GenericEdge"
import { EdgeMiddleLabels } from "../labelTypes/EdgeMiddleLabels"
import { EdgeIncludeExtendLabel } from "../labelTypes/EdgeIncludeExtendLabel"
import { useEdgeConfig } from "@/hooks/useEdgeConfig"
import { useStraightPathEdge } from "@/hooks/useStraightPathEdge"
import { useDiagramStore, usePopoverStore } from "@/store/context"
import { useShallow } from "zustand/shallow"
import { useToolbar } from "@/hooks"
import { useRef } from "react"
import { EDGE_HIGHTLIGHT_STROKE_WIDTH } from "@/constants"
import { FeedbackDropzone } from "@/components/wrapper/FeedbackDropzone"

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
}: BaseEdgeProps) => {
  const anchorRef = useRef<SVGSVGElement | null>(null)
  const { handleDelete } = useToolbar({ id })

  const config = useEdgeConfig(
    type as
      | "UseCaseAssociation"
      | "UseCaseInclude"
      | "UseCaseExtend"
      | "UseCaseGeneralization"
  )
  const showRelationshipLabels =
    "showRelationshipLabels" in config ? config.showRelationshipLabels : false

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
          }}
        />

        <FeedbackDropzone elementId={id} asElement="path">
          <path
            ref={pathRef}
            className="edge-overlay"
            d={overlayPath}
            fill="none"
            strokeWidth={EDGE_HIGHTLIGHT_STROKE_WIDTH}
            pointerEvents="stroke"
            style={{ opacity: 0.4 }}
          />
        </FeedbackDropzone>
      </g>

      <EdgeMiddleLabels
        label={data?.label}
        pathMiddlePosition={edgeData.pathMiddlePosition}
        isMiddlePathHorizontal={edgeData.isMiddlePathHorizontal}
        showRelationshipLabels={showRelationshipLabels}
        sourcePoint={edgeData.sourcePoint}
        targetPoint={edgeData.targetPoint}
        isUseCasePath={true}
      />

      <EdgeIncludeExtendLabel
        relationshipType={
          type === "UseCaseInclude"
            ? "include"
            : type === "UseCaseExtend"
              ? "extend"
              : undefined
        }
        showRelationshipLabels={
          type === "UseCaseInclude" || type === "UseCaseExtend"
        }
        pathMiddlePosition={edgeData.pathMiddlePosition}
        sourcePoint={edgeData.sourcePoint}
        targetPoint={edgeData.targetPoint}
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
