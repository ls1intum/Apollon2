import { useCallback, useEffect, useRef, useState } from "react"
import { BaseEdge, getSmoothStepPath, useReactFlow } from "@xyflow/react"
import { EdgePopover } from "@/components"
import {
  STEP_BOARDER_RADIUS,
  MARKER_PADDING,
  SOURCE_CONNECTION_POINT_PADDING,
} from "@/constants"
import {
  adjustSourceCoordinates,
  adjustTargetCoordinates,
  getToolbarPosition,
  calculateEdgeLabels,
} from "@/utils"
import { useToolbar } from "@/hooks"
import { ExtendedEdgeProps } from "./EdgeProps"
import { CustomEdgeToolbar } from "@/components"
import { getEdgeMarkerStyles } from "@/utils"
import { IPoint, tryFindStraightPath, pointsToSvgPath } from "./Connection"
import { simplifySvgPath, removeDuplicatePoints, parseSvgPath, calculateInnerMidpoints } from "@/utils/edgeUtils"



export const GenericEdge = ({
  id,
  selected,
  type,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: ExtendedEdgeProps) => {
  // const {
  //   handleSourceRoleChange,
  //   handleSourceMultiplicityChange,
  //   handleTargetRoleChange,
  //   handleTargetMultiplicityChange,
  //   handleEdgeTypeChange,
  //   handleSwap,
  // } = useEdgePopOver({ id, selected: Boolean(selected) })
  const draggingIndexRef = useRef<number>()
  const dragOffsetRef = useRef<IPoint>({x:0, y:0})
  const { handleDelete } = useToolbar({ id })
  const [edgePopoverAnchor, setEdgePopoverAnchor] =
    useState<HTMLElement | null>(null)
  const { updateEdge, getNode } = useReactFlow()

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

  const [edgePath] = getSmoothStepPath({
    sourceX: adjustedSourceCoordinates.sourceX,
    sourceY: adjustedSourceCoordinates.sourceY,
    sourcePosition,
    targetX: adjustedTargetCoordinates.targetX,
    targetY: adjustedTargetCoordinates.targetY,
    targetPosition,
    borderRadius: STEP_BOARDER_RADIUS,
  })

  const toolbarPosition = getToolbarPosition(
    adjustedSourceCoordinates,
    adjustedTargetCoordinates
  )

  const handleEditIconClick = (event: React.MouseEvent<HTMLElement>) => {
    setEdgePopoverAnchor(event.currentTarget)
  }

  const {
    roleX: sourceRoleX,
    roleY: sourceRoleY,
    multiplicityX: sourceMultiplicityX,
    multiplicityY: sourceMultiplicityY,
  } = calculateEdgeLabels(sourceX, sourceY, sourcePosition)

  const {
    roleX: targetRoleX,
    roleY: targetRoleY,
    multiplicityX: targetMultiplicityX,
    multiplicityY: targetMultiplicityY,
  } = calculateEdgeLabels(targetX, targetY, targetPosition)

  const sourceNode = getNode(source)!
  const targetNode = getNode(target)!
  console.log(
    "source, target",
    adjustedSourceCoordinates.sourceX,
    adjustedSourceCoordinates.sourceY,
    adjustedTargetCoordinates.targetX,
    adjustedTargetCoordinates.targetY
  )

  const simplifiedpath = simplifySvgPath(edgePath)
  const straightPath = tryFindStraightPath(
    {
      position: { x: sourceNode.position.x, y: sourceNode.position.y },
      width: sourceNode.width ?? 100,
      height: sourceNode.height ?? 160,
      direction: sourcePosition,
    },
    {
      position: { x: targetNode.position.x, y: targetNode.position.y },
      width: targetNode.width ?? 100,
      height: targetNode.height ?? 160,
      direction: targetPosition,
    }
  )

  //const currentPath = straightPath !== null ? straightPath : edgePath;
  //console.log("Current", currentPath)
  const parsedPath = parseSvgPath(simplifiedpath)
  const initialPoints = removeDuplicatePoints(parsedPath)
  const [points, setPoints] = useState<IPoint[]>(initialPoints)

  //const midpoints = calculateInnerMidpoints(removedPath)
  //console.log("Midpoints", midpoints)

  //console.log("Parsed svg path", parsedPath)
  //console.log("Remove", initialPoints)

  console.log("POINTS", points)

  useEffect(() => {
    const newPoints = removeDuplicatePoints(parseSvgPath(simplifiedpath))
    setPoints(newPoints)
  }, [simplifiedpath])

  const midpoints = calculateInnerMidpoints(points)

  const currentPath =
    straightPath !== null ? straightPath : pointsToSvgPath(points)

  // const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({
  //   x: 0,
  //   y: 0,
  // })

  const handleMouseDown = (event: React.MouseEvent, index: number) => {
    console.log("Handle mouse down", event)
    const currentMidpoint = midpoints[index]
    const offsetX = event.clientX - currentMidpoint.x
    const offsetY = event.clientY - currentMidpoint.y

    draggingIndexRef.current = index
    dragOffsetRef.current = { x: offsetX, y: offsetY }
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp, { once: true })
  }

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      const draggingIndex = draggingIndexRef.current
      console.log("handle mouse move", event, draggingIndex, dragOffsetRef.current)

      if (draggingIndex === undefined) return
      const newX = event.clientX - dragOffsetRef.current.x
      const newY = event.clientY - dragOffsetRef.current.y
      console.log("new values", newX, newY)
      const startIdx = draggingIndex + 1
      const endIdx = draggingIndex + 2
      const newPoints = [...points]
      const linePosition = newPoints[startIdx].x == newPoints[endIdx].x ? "vertical" : "horizontal"
      switch (linePosition) {
        case 'horizontal':
          newPoints[startIdx] = { x: points[startIdx].x, y: newY }
          newPoints[endIdx] = { x: points[endIdx].x, y: newY }
          break;
        case 'vertical':
          newPoints[startIdx] = { x: newX, y: points[startIdx].y }
          newPoints[endIdx] = { x: newX, y: points[endIdx].y }
          break;
        default:
          break;
      }
      
      setPoints(newPoints)
      console.log("New points", newPoints)
      updateEdge(id, { data: { ...data, customPoints: newPoints } })
    },
    [dragOffsetRef.current, points, updateEdge, id, data]
  )

  const handleMouseUp = useCallback(() => {
    draggingIndexRef.current = undefined
    document.removeEventListener("mousemove", handleMouseMove)
  }, [handleMouseMove])
  return (
    <>
    <g className="edge-container">
      {/* Render the visible edge (stays black) */}
      <BaseEdge
        id={id}
        path={currentPath}
        markerEnd={markerEnd}
        pointerEvents="none"
        strokeDasharray={strokeDashArray}
      />

      {/* Invisible overlay to capture pointer events */}
      <path
        className="edge-overlay"
        d={currentPath}
        fill="none"
        strokeWidth={12}
        pointerEvents="stroke"
        style={{ transition: "stroke 0.2s ease-in-out" }}
      />
      {midpoints.map((point, idx) => (
        <circle
          className="edge-circle"
          pointerEvents={"all"}
          key={idx}
          cx={point.x}
          cy={point.y}
          r={10}
          fill="lightgray"
          stroke="none"
          style={{ cursor: "grab" }}
          onMouseDown={(e) => handleMouseDown(e, idx)}
        />
      ))}
    </g>
      {selected && (
        <CustomEdgeToolbar
          x={toolbarPosition.x}
          y={toolbarPosition.y}
          onEditClick={handleEditIconClick}
          onDeleteClick={handleDelete}
        />
      )}

      {/* Render the popover for editing edge properties */}
      <EdgePopover
        source={source}
        target={target}
        edgeId={id}
        selected={Boolean(selected)}
        anchorEl={edgePopoverAnchor}
        open={Boolean(edgePopoverAnchor)}
        onClose={() => {
          setEdgePopoverAnchor(null)
          updateEdge(id, { selected: false })
        }}
      />

      {/* Render labels directly on the SVG */}

      {data?.sourceRole && (
        <text
          x={sourceRoleX}
          y={sourceRoleY}
          textAnchor="middle"
          style={{ fontSize: "16px", fill: "black", userSelect: "none" }}
        >
          {data?.sourceRole}
        </text>
      )}
      {data?.sourceMultiplicity && (
        <text
          x={sourceMultiplicityX}
          y={sourceMultiplicityY}
          textAnchor="middle"
          style={{ fontSize: "16px", fill: "black", userSelect: "none" }}
        >
          {data?.sourceMultiplicity}
        </text>
      )}

      {data?.targetRole && (
        <text
          x={targetRoleX}
          y={targetRoleY}
          textAnchor="middle"
          style={{ fontSize: "16px", fill: "black", userSelect: "none" }}
        >
          {data?.targetRole}
        </text>
      )}
      {data?.targetMultiplicity && (
        <text
          x={targetMultiplicityX}
          y={targetMultiplicityY}
          textAnchor="middle"
          style={{ fontSize: "16px", fill: "black", userSelect: "none" }}
        >
          {data?.targetMultiplicity}
        </text>
      )}
    </>
  )
}
