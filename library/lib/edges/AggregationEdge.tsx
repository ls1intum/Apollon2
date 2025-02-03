import { useState } from "react"
import {
  BaseEdge,
  EdgeProps,
  getSmoothStepPath,
  type Edge,
} from "@xyflow/react"

import { EdgePopover } from "@/components"
import {
  STEP_BOARDER_RADIUS,
  RHOMBUS_MARKER_PADDING,
  SOURCE_CONNECTION_POINT_PADDING,
} from "@/constants"
import { adjustSourceCoordinates, adjustTargetCoordinates } from "@/utils"
import { useEdgePopOver, useToolbar } from "@/hooks"
import { CustomEdgeProps } from "./EdgeProps"

import { CustomEdgeToolbar } from "@/components"

// --- AggregationEdge Component ---
// Here we destructure the data prop and directly set default values.
export const AggregationEdge = ({
  id,
  selected,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data: { sourceRole, sourceMultiplicity, targetRole, targetMultiplicity } = {
    sourceRole: "",
    sourceMultiplicity: "",
    targetRole: "",
    targetMultiplicity: "",
  },
}: EdgeProps<Edge<CustomEdgeProps>>) => {
  const [toolbarOpen, setToolbarOpen] = useState(false)
  const [edgePopoverAnchor, setEdgePopoverAnchor] =
    useState<HTMLElement | null>(null)
  const [isHovered, setIsHovered] = useState(false)

  const {
    handleSourceRoleChange,
    handleSourceMultiplicityChange,
    handleTargetRoleChange,
    handleTargetMultiplicityChange,
    handleEdgeTypeChange,
    handleSwap,
  } = useEdgePopOver({ id, selected: Boolean(selected) })
  const { handleDelete } = useToolbar({ id })

  const markerPadding = RHOMBUS_MARKER_PADDING
  const sourceConnectionPointPadding = SOURCE_CONNECTION_POINT_PADDING
  const borderRadius = STEP_BOARDER_RADIUS

  // --- Calculate adjusted connection coordinates for source and target ---
  const adjustedTargetCoordinates = adjustTargetCoordinates(
    targetX,
    targetY,
    targetPosition,
    markerPadding
  )
  const adjustedSourceCoordinates = adjustSourceCoordinates(
    sourceX,
    sourceY,
    sourcePosition,
    sourceConnectionPointPadding
  )

  // --- Generate a smooth edge path ---
  const [edgePath] = getSmoothStepPath({
    sourceX: adjustedSourceCoordinates.sourceX,
    sourceY: adjustedSourceCoordinates.sourceY,
    sourcePosition,
    targetX: adjustedTargetCoordinates.targetX,
    targetY: adjustedTargetCoordinates.targetY,
    targetPosition,
    borderRadius,
  })

  const toolbarPosition = {
    x:
      (adjustedSourceCoordinates.sourceX + adjustedTargetCoordinates.targetX) /
        2 +
      40,
    y:
      (adjustedSourceCoordinates.sourceY + adjustedTargetCoordinates.targetY) /
        2 -
      80,
  }

  // --- Handlers ---
  const handleEdgeClick = () => {
    setToolbarOpen(!toolbarOpen)
    if (edgePopoverAnchor) setEdgePopoverAnchor(null)
  }

  const handleEditIconClick = (event: React.MouseEvent<HTMLElement>) => {
    setEdgePopoverAnchor(event.currentTarget)
  }

  return (
    <>
      {/* Render the visible edge (stays black) */}
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd="url(#white-rhombus)"
        pointerEvents="none"
        style={{
          stroke: "#000000",
          cursor: "pointer",
        }}
      />

      {/* Invisible overlay to capture pointer events */}
      <path
        d={edgePath}
        fill="none"
        stroke={isHovered ? "rgba(128, 128, 128, 0.5)" : "transparent"}
        strokeWidth={12}
        pointerEvents="stroke"
        style={{ transition: "stroke 0.2s ease-in-out" }}
        onClick={handleEdgeClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />

      {/* Render the toolbar if toggled */}
      {toolbarOpen && (
        <CustomEdgeToolbar
          x={toolbarPosition.x}
          y={toolbarPosition.y}
          onEditClick={handleEditIconClick}
          onDeleteClick={handleDelete}
        />
      )}

      {/* Render the popover for editing edge properties */}
      <EdgePopover
        edgeId={id}
        anchorEl={edgePopoverAnchor}
        open={Boolean(edgePopoverAnchor)}
        onClose={() => setEdgePopoverAnchor(null)}
        onEdgeTypeChange={handleEdgeTypeChange}
        onSourceRoleChange={handleSourceRoleChange}
        onSourceMultiplicityChange={handleSourceMultiplicityChange}
        onTargetRoleChange={handleTargetRoleChange}
        onTargetMultiplicityChange={handleTargetMultiplicityChange}
        onSwap={handleSwap}
      />

      {/* Render labels directly on the SVG using the stored coordinates */}
      {/* Source Endpoint */}
      {sourceRole && (
        <text
          x={sourceX}
          y={sourceY - 10}
          textAnchor="middle"
          style={{ fontSize: "12px", fill: "black", userSelect: "none" }}
        >
          {sourceRole}
        </text>
      )}
      {sourceMultiplicity && (
        <text
          x={sourceX}
          y={sourceY + 15}
          textAnchor="middle"
          style={{ fontSize: "12px", fill: "black", userSelect: "none" }}
        >
          {sourceMultiplicity}
        </text>
      )}

      {/* Target Endpoint */}
      {targetRole && (
        <text
          x={targetX}
          y={targetY - 10}
          textAnchor="middle"
          style={{ fontSize: "12px", fill: "black", userSelect: "none" }}
        >
          {targetRole}
        </text>
      )}
      {targetMultiplicity && (
        <text
          x={targetX}
          y={targetY + 15}
          textAnchor="middle"
          style={{ fontSize: "12px", fill: "black", userSelect: "none" }}
        >
          {targetMultiplicity}
        </text>
      )}
    </>
  )
}
