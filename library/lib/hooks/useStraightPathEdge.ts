import { useEffect, useMemo, useRef, useState } from "react"
import { BaseEdgeProps } from "../edges/GenericEdge"
import {
  calculateOverlayPath,
  calculateStraightPath,
  getEdgeMarkerStyles,
} from "@/utils/edgeUtils"
import { useDiagramModifiable } from "./useDiagramModifiable"
import { IPoint } from "../edges/Connection"

interface UseStraightPathEdgeProps extends BaseEdgeProps {
  // Add any additional props specific to straight path edges
}

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
}: UseStraightPathEdgeProps) => {
  const pathRef = useRef<SVGPathElement | null>(null)
  const isDiagramModifiable = useDiagramModifiable()

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

  const { markerEnd, strokeDashArray } = getEdgeMarkerStyles(type)

  const currentPath = useMemo(() => {
    return calculateStraightPath(sourceX, sourceY, targetX, targetY, type)
  }, [sourceX, sourceY, targetX, targetY, type])

  const overlayPath = useMemo(() => {
    return calculateOverlayPath(sourceX, sourceY, targetX, targetY, type)
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

  const edgeData: StraightPathEdgeData = {
    pathMiddlePosition,
    isMiddlePathHorizontal,
    sourcePoint,
    targetPoint,
  }

  return {
    // Refs
    pathRef,
    
    // Edge data
    edgeData,
    
    // Path calculations
    currentPath,
    overlayPath,
    
    // Styling
    markerEnd,
    strokeDashArray,
    
    // Computed values
    sourcePoint,
    targetPoint,
    isDiagramModifiable,
  }
}
