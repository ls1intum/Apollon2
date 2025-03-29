import { useState} from "react"
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
import { IPoint, Connection, tryFindStraightPath } from "./Connection"


// Extend the props to include markerEnd and markerPadding.
export function pointsToSvgPath(points: IPoint[]): string {
  if (points.length === 0) return '';

  // Start with the first point using the "M" command.
  const pathCommands = [`M ${points[0].x} ${points[0].y}`];

  // Add "L" command for each subsequent point.
  for (let i = 1; i < points.length; i++) {
    pathCommands.push(`L ${points[i].x} ${points[i].y}`);
  }

  // Combine commands into a single string
  return pathCommands.join(' ');
}


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
  const { handleDelete } = useToolbar({ id })
  const [edgePopoverAnchor, setEdgePopoverAnchor] =
    useState<HTMLElement | null>(null)
  const { updateEdge, getNode } = useReactFlow()

  const { markerPadding, markerEnd, strokeDashArray } =
    getEdgeMarkerStyles(type)
  const padding = markerPadding ?? MARKER_PADDING

  // Use the passed markerPadding when adjusting the target coordinates.
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

  const path: IPoint[] = Connection.computePath(
    { position: {x: sourceNode.position.x ,y: sourceNode.position.y}, width: sourceNode.width ?? 100, height: sourceNode.height ?? 160 , direction: sourcePosition },
    { position: {x: targetNode.position.x ,y: targetNode.position.y}, width: targetNode.width ?? 100, height: targetNode.height ?? 160 , direction: targetPosition },
    { isStraight: true, isVariable: false }
  );
  const svgPath = pointsToSvgPath(path)
  console.log(edgePath)
  console.log("source", sourceNode)
  console.log("target", targetNode)
  console.log("computed path", path)
  console.log("svg", svgPath)
  const straightPath = tryFindStraightPath({ position: {x: sourceNode.position.x ,y: sourceNode.position.y}, width: sourceNode.width ?? 100, height: sourceNode.height ?? 160 , direction: sourcePosition },
    { position: {x: targetNode.position.x ,y: targetNode.position.y}, width: targetNode.width ?? 100, height: targetNode.height ?? 160 , direction: targetPosition },
 )

 console.log("Straight path", straightPath, sourcePosition, targetPosition)
 
 const currentPath = straightPath !== null ? straightPath : edgePath;
 console.log("Current", currentPath)
  return (
    <>
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
        d={currentPath}
        fill="none"
        strokeWidth={12}
        pointerEvents="stroke"
        style={{ transition: "stroke 0.2s ease-in-out" }}
      />

      {/* Render the toolbar if the edge is selected */}
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

