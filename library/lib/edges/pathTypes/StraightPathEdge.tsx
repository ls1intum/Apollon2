import { useMemo, useRef, useEffect } from "react"
import React from "react"
import { BaseEdge } from "@xyflow/react"
import { 
  BaseEdgeProps,
  useEdgeState,
  useEdgePath,
  CommonEdgeElements,
} from "../GenericEdge"
import { 
  calculateOverlayPath,
  calculateStraightPath, 
  getEdgeMarkerStyles,
  //adjustTargetCoordinates,
  //adjustSourceCoordinates,
} from "@/utils/edgeUtils"
import { useDiagramModifiable } from "@/hooks/useDiagramModifiable"
import { useDiagramStore, usePopoverStore } from "@/store/context"
import { useShallow } from "zustand/shallow"
import { useToolbar } from "@/hooks"
import { IPoint } from "../Connection"

interface StraightPathEdgeProps extends BaseEdgeProps {
  children?: React.ReactNode | ((edgeData: StraightPathEdgeData) => React.ReactNode)
}

// Data passed to children components
export interface StraightPathEdgeData {
  pathMiddlePosition: IPoint
  isMiddlePathHorizontal: boolean
  sourcePoint: IPoint
  targetPoint: IPoint
}

export const StraightPathEdge = ({
  id,
  type,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  children,
}: StraightPathEdgeProps) => {
  const pathRef = useRef<SVGPathElement | null>(null)
  const anchorRef = useRef<SVGSVGElement | null>(null)
  const isDiagramModifiable = useDiagramModifiable()
  
  const { assessments } = useDiagramStore(
    useShallow((state) => ({
      assessments: state.assessments,
    }))
  )
  
  const setPopOverElementId = usePopoverStore(
    useShallow((state) => state.setPopOverElementId)
  )

  const { handleDelete } = useToolbar({ id })
  const { updateMiddlePosition } = useEdgePath(sourceX, sourceY, targetX, targetY, pathRef)
  
  const {
    pathMiddlePosition,
    setPathMiddlePosition,
    isMiddlePathHorizontal,
    setIsMiddlePathHorizontal,
  } = useEdgeState()

  const { markerEnd, strokeDashArray} = getEdgeMarkerStyles(type)
  //const padding = markerPadding ?? MARKER_PADDING

  const currentPath = useMemo(() => {

    return calculateStraightPath(
      sourceX, 
      sourceY, 
      targetX, 
      targetY, 
      type,
      false
    )
  }, [sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition ])


  const overlayPath = useMemo(() => {
    return calculateOverlayPath(
      sourceX, 
      sourceY, 
      targetX, 
      targetY, 
      type,
    )
  }, [sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition ])


  // Update middle position for straight paths
  useEffect(() => {
    updateMiddlePosition(
      currentPath,
      setPathMiddlePosition,
      setIsMiddlePathHorizontal,
      true // isDirectPath = true for straight paths
    )
  }, [currentPath, updateMiddlePosition, setPathMiddlePosition, setIsMiddlePathHorizontal])

  const sourcePoint = { x: sourceX, y: sourceY }
  const targetPoint = { x: targetX, y: targetY }

  // Create context data for children
  const edgeData: StraightPathEdgeData = {
    pathMiddlePosition,
    isMiddlePathHorizontal,
    sourcePoint,
    targetPoint,
  }

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

        <path
          ref={pathRef}
          className="edge-overlay"
          d={overlayPath}
          fill="none"
          strokeWidth={15}
          pointerEvents="stroke"
          style={{ opacity: 0.4 }}
        />
      </g>

      {/* Render custom labels passed as children with edge data */}
      {typeof children === 'function' ? children(edgeData) : children}

      <CommonEdgeElements
        id={id}
        pathMiddlePosition={pathMiddlePosition}
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

// Export computed values for use by label components
export const useStraightPathData = (straightPathEdgeProps: StraightPathEdgeProps) => {
  const { pathMiddlePosition, isMiddlePathHorizontal } = useEdgeState()
  
  return {
    pathMiddlePosition,
    isMiddlePathHorizontal,
    sourcePoint: { x: straightPathEdgeProps.sourceX, y: straightPathEdgeProps.sourceY },
    targetPoint: { x: straightPathEdgeProps.targetX, y: straightPathEdgeProps.targetY },
  }
}