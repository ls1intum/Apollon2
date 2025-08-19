import { useEffect, useMemo, useRef, useState } from "react"
import React from "react"
import { BaseEdge } from "@xyflow/react"
import { BaseEdgeProps, CommonEdgeElements } from "../GenericEdge"
import {
  adjustSourceCoordinates,
  adjustTargetCoordinates,
  calculateOverlayPath,
  calculateStraightPath,
  getEdgeMarkerStyles,
} from "@/utils/edgeUtils"
import { useDiagramModifiable } from "@/hooks/useDiagramModifiable"
import { useDiagramStore, usePopoverStore } from "@/store/context"
import { useShallow } from "zustand/shallow"
import { useToolbar } from "@/hooks"
import { IPoint } from "../Connection"
import { MARKER_PADDING, SOURCE_CONNECTION_POINT_PADDING } from "@/constants"

interface StraightPathEdgeProps extends BaseEdgeProps {
  children?:
    | React.ReactNode
    | ((edgeData: StraightPathEdgeData) => React.ReactNode)
}

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
  sourcePosition,
  targetX,
  targetY,
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

  const [pathMiddlePosition, setPathMiddlePosition] = useState<IPoint>(() => ({
    x: (sourceX + targetX) / 2,
    y: (sourceY + targetY) / 2,
  }))
  const [isMiddlePathHorizontal, setIsMiddlePathHorizontal] = useState<boolean>(
    () => {
      const dx = Math.abs(targetX - sourceX)
      const dy = Math.abs(targetY - sourceY)
      return dx > dy
    }
  )

  const setPopOverElementId = usePopoverStore(
    useShallow((state) => state.setPopOverElementId)
  )

  const { handleDelete } = useToolbar({ id })

  const { markerPadding, markerEnd, strokeDashArray } =
    getEdgeMarkerStyles(type)
  const padding = markerPadding ?? MARKER_PADDING
  const adjustedTargetCoordinates = adjustTargetCoordinates(
    targetX,
    targetY,
    targetPosition,
    padding
  )
  const adjustedSourceCoordinates = adjustSourceCoordinates(
    sourceX,
    sourceY,
    sourcePosition,
    SOURCE_CONNECTION_POINT_PADDING
  )

  const currentPath = useMemo(() => {
    return calculateStraightPath(
      adjustedSourceCoordinates.sourceX,
      adjustedSourceCoordinates.sourceY,
      adjustedTargetCoordinates.targetX,
      adjustedTargetCoordinates.targetY,
      type
    )
  }, [sourceX, sourceY, targetX, targetY, type])

  const overlayPath = useMemo(() => {
    return calculateOverlayPath(
      adjustedSourceCoordinates.sourceX,
      adjustedSourceCoordinates.sourceY,
      adjustedTargetCoordinates.targetX,
      adjustedTargetCoordinates.targetY,
      type
    )
  }, [sourceX, sourceY, targetX, targetY, type])

  useEffect(() => {
    if (pathRef.current) {
      try {
        const totalLength = pathRef.current.getTotalLength()
        if (totalLength === 0 || !isFinite(totalLength)) {
          const middleX = (sourceX + targetX) / 2
          const middleY = (sourceY + targetY) / 2
          setPathMiddlePosition({ x: middleX, y: middleY })

          const dx = Math.abs(targetX - sourceX)
          const dy = Math.abs(targetY - sourceY)
          setIsMiddlePathHorizontal(dx > dy)
          return
        }

        const halfLength = totalLength / 2
        const middlePoint = pathRef.current.getPointAtLength(halfLength)
        const pointOnCloseToMiddle = pathRef.current.getPointAtLength(
          Math.min(halfLength + 2, totalLength)
        )
        const isHorizontal =
          Math.abs(pointOnCloseToMiddle.x - middlePoint.x) >
          Math.abs(pointOnCloseToMiddle.y - middlePoint.y)

        setIsMiddlePathHorizontal(isHorizontal)
        setPathMiddlePosition({ x: middlePoint.x, y: middlePoint.y })
      } catch (error) {
        console.warn("Path calculation failed, using fallback:", error)
        // Fallback to simple midpoint calculation
        const middleX = (sourceX + targetX) / 2
        const middleY = (sourceY + targetY) / 2
        setPathMiddlePosition({ x: middleX, y: middleY })

        const dx = Math.abs(targetX - sourceX)
        const dy = Math.abs(targetY - sourceY)
        setIsMiddlePathHorizontal(dx > dy)
      }
    }
  }, [currentPath, sourceX, sourceY, targetX, targetY])

  useEffect(() => {
    const middleX = (sourceX + targetX) / 2
    const middleY = (sourceY + targetY) / 2
    setPathMiddlePosition({ x: middleX, y: middleY })

    const dx = Math.abs(targetX - sourceX)
    const dy = Math.abs(targetY - sourceY)
    setIsMiddlePathHorizontal(dx > dy)
  }, [sourceX, sourceY, targetX, targetY])

  const sourcePoint = { x: sourceX, y: sourceY }
  const targetPoint = { x: targetX, y: targetY }

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

      {pathMiddlePosition && (
        <>
          {typeof children === "function"
            ? children({
                pathMiddlePosition,
                isMiddlePathHorizontal,
                sourcePoint,
                targetPoint,
              })
            : children}

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
      )}
    </>
  )
}
