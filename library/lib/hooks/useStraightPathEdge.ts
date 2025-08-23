import { useEffect, useMemo, useRef, useState } from "react"
import { BaseEdgeProps } from "../edges/GenericEdge"
import {
  calculateOverlayPath,
  calculateStraightPath,
  getEdgeMarkerStyles,
  adjustSourceCoordinates,
  adjustTargetCoordinates,
} from "@/utils/edgeUtils"
import { MARKER_PADDING, SOURCE_CONNECTION_POINT_PADDING } from "@/constants/edgeConstants"
import { useDiagramModifiable } from "./useDiagramModifiable"
import { IPoint } from "../edges/Connection"

export interface StraightPathEdgeData {
  pathMiddlePosition: IPoint
  isMiddlePathHorizontal: boolean
  sourcePoint: IPoint
  targetPoint: IPoint
}

export const useStraightPathEdge = ({
  type,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}: Omit<BaseEdgeProps, 'id' | 'source' | 'target' | 'data'>) => {
  const pathRef = useRef<SVGPathElement | null>(null)
  const isDiagramModifiable = useDiagramModifiable()

  // Get marker styles which includes markerPadding
  const { markerEnd, strokeDashArray, markerPadding } = getEdgeMarkerStyles(type)
  
  // Calculate padding for coordinate adjustment
  const padding = markerPadding ?? MARKER_PADDING
  
  // Adjust coordinates based on position and padding
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

  const [pathMiddlePosition, setPathMiddlePosition] = useState<IPoint>(() => ({
    x: (adjustedSourceCoordinates.sourceX + adjustedTargetCoordinates.targetX) / 2,
    y: (adjustedSourceCoordinates.sourceY + adjustedTargetCoordinates.targetY) / 2,
  }))
  const [isMiddlePathHorizontal, setIsMiddlePathHorizontal] = useState<boolean>(
    () => {
      const dx = Math.abs(adjustedTargetCoordinates.targetX - adjustedSourceCoordinates.sourceX)
      const dy = Math.abs(adjustedTargetCoordinates.targetY - adjustedSourceCoordinates.sourceY)
      return dx > dy
    }
  )

  const currentPath = useMemo(() => {
    return calculateStraightPath(
      adjustedSourceCoordinates.sourceX, 
      adjustedSourceCoordinates.sourceY, 
      adjustedTargetCoordinates.targetX, 
      adjustedTargetCoordinates.targetY, 
      type
    )
  }, [adjustedSourceCoordinates.sourceX, adjustedSourceCoordinates.sourceY, adjustedTargetCoordinates.targetX, adjustedTargetCoordinates.targetY, type])

  const overlayPath = useMemo(() => {
    return calculateOverlayPath(
      adjustedSourceCoordinates.sourceX, 
      adjustedSourceCoordinates.sourceY, 
      adjustedTargetCoordinates.targetX, 
      adjustedTargetCoordinates.targetY, 
      type
    )
  }, [adjustedSourceCoordinates.sourceX, adjustedSourceCoordinates.sourceY, adjustedTargetCoordinates.targetX, adjustedTargetCoordinates.targetY, type])

  useEffect(() => {
    if (pathRef.current) {
      try {
        const totalLength = pathRef.current.getTotalLength()
        if (totalLength === 0 || !isFinite(totalLength)) {
          const middleX = (adjustedSourceCoordinates.sourceX + adjustedTargetCoordinates.targetX) / 2
          const middleY = (adjustedSourceCoordinates.sourceY + adjustedTargetCoordinates.targetY) / 2
          setPathMiddlePosition({ x: middleX, y: middleY })

          const dx = Math.abs(adjustedTargetCoordinates.targetX - adjustedSourceCoordinates.sourceX)
          const dy = Math.abs(adjustedTargetCoordinates.targetY - adjustedSourceCoordinates.sourceY)
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
        const dy = Math.abs(adjustedTargetCoordinates.targetY - adjustedSourceCoordinates.sourceY)
        setIsMiddlePathHorizontal(dx > dy)
      }
    }
  }, [currentPath, adjustedSourceCoordinates.sourceX, adjustedSourceCoordinates.sourceY, adjustedTargetCoordinates.targetX, adjustedTargetCoordinates.targetY])

  useEffect(() => {
    const middleX = (adjustedSourceCoordinates.sourceX + adjustedTargetCoordinates.targetX) / 2
    const middleY = (adjustedSourceCoordinates.sourceY + adjustedTargetCoordinates.targetY) / 2
    setPathMiddlePosition({ x: middleX, y: middleY })

    const dx = Math.abs(adjustedTargetCoordinates.targetX - adjustedSourceCoordinates.sourceX)
    const dy = Math.abs(adjustedTargetCoordinates.targetY - adjustedSourceCoordinates.sourceY)
    setIsMiddlePathHorizontal(dx > dy)
  }, [adjustedSourceCoordinates.sourceX, adjustedSourceCoordinates.sourceY, adjustedTargetCoordinates.targetX, adjustedTargetCoordinates.targetY])

  const sourcePoint = { x: adjustedSourceCoordinates.sourceX, y: adjustedSourceCoordinates.sourceY }
  const targetPoint = { x: adjustedTargetCoordinates.targetX, y: adjustedTargetCoordinates.targetY }

  const edgeData: StraightPathEdgeData = {
    pathMiddlePosition,
    isMiddlePathHorizontal,
    sourcePoint,
    targetPoint,
  }

  return {
    pathRef,
    edgeData,
    currentPath,
    overlayPath,
    markerEnd,
    strokeDashArray,
    sourcePoint,
    targetPoint,
    isDiagramModifiable,
  }
}
