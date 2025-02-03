import { useState, useEffect } from "react";
import {
  BaseEdge,
  EdgeProps,
  getSmoothStepPath,
  type Edge,
} from "@xyflow/react";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditIcon from "@mui/icons-material/Edit";
import { Box } from "@mui/material";
import { EdgePopover } from "../components/popovers/EdgePopover";
import {
  STEP_BOARDER_RADIUS,
  RHOMBUS_MARKER_PADDING,
  SOURCE_CONNECTION_POINT_PADDING,
} from "@/constants";
import { adjustSourceCoordinates, adjustTargetCoordinates } from "@/utils";
import { useEdgePopOver } from "@/hooks/useEdges";


// --- Toolbar rendered over the edge ---
interface CustomEdgeToolbarProps {
  x: number;
  y: number;
  onEditClick: (event: React.MouseEvent<HTMLElement>) => void;
}

export type EdgeCustomProps = {
  sourceRole: string;
  sourceMultiplicity: string;
  targetRole: string;
  targetMultiplicity: string;
};



const CustomEdgeToolbar = ({ x, y, onEditClick }: CustomEdgeToolbarProps) => {
  return (
    <foreignObject width={40} height={80} x={x - 20} y={y - 60}>
      <Box
        sx={{
          width: "40px",
          height: "80px",
          backgroundColor: "#f8fafc",
          boxShadow: "4px 4px 4px 4px rgb(0 0 0 / .2)",
          borderRadius: "8px",
          padding: "8px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
          alignItems: "center",
          cursor: "pointer",
        }}
      >
        {/* Optional Delete Icon */}
        <Box
          sx={{
            backgroundColor: "#f8fafc",
            borderRadius: "8px",
            padding: "8px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <DeleteOutlineOutlinedIcon style={{ width: 16, height: 16 }} />
        </Box>
        {/* Edit Icon */}
        <Box
          sx={{
            backgroundColor: "#f8fafc",
            borderRadius: "8px",
            padding: "8px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={(e) => {
            e.stopPropagation();
            onEditClick(e);
          }}
        >
          <EditIcon style={{ width: 16, height: 16 }} />
        </Box>
      </Box>
    </foreignObject>
  );
};

// --- AggregationEdge Component ---
// Here we destructure the data prop and directly set a default value for targetRole.
export const AggregationEdge = ({
  id,
  selected,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data: {sourceRole,sourceMultiplicity, targetRole, targetMultiplicity } = { sourceRole:"", sourceMultiplicity: "", targetRole: "" , targetMultiplicity: "" },
}: EdgeProps<Edge<EdgeCustomProps>>) => {
  // --- State for toolbar and popover ---
  const [toolbarOpen, setToolbarOpen] = useState(false);
  const [edgePopoverAnchor, setEdgePopoverAnchor] = useState<HTMLElement | null>(null);

  const {handleSourceRoleChange, handleSourceMultiplicityChange, handleTargetRoleChange, handleTargetMultiplicityChange } = useEdgePopOver({ id, selected: Boolean(selected) });

  // --- Edge label values stored in state (updated via the popover) ---
  const [edgeType, setEdgeType] = useState("Association");


  // --- Constants for computing connection points ---
  const markerPadding = RHOMBUS_MARKER_PADDING;
  const sourceConnectionPointPadding = SOURCE_CONNECTION_POINT_PADDING;
  const borderRadius = STEP_BOARDER_RADIUS;

  // --- Calculate adjusted connection coordinates for source and target ---
  const adjustedTargetCoordinates = adjustTargetCoordinates(
    targetX,
    targetY,
    targetPosition,
    markerPadding
  );
  const adjustedSourceCoordinates = adjustSourceCoordinates(
    sourceX,
    sourceY,
    sourcePosition,
    sourceConnectionPointPadding
  );

  // --- Generate a smooth edge path ---
  const [edgePath] = getSmoothStepPath({
    sourceX: adjustedSourceCoordinates.sourceX,
    sourceY: adjustedSourceCoordinates.sourceY,
    sourcePosition,
    targetX: adjustedTargetCoordinates.targetX,
    targetY: adjustedTargetCoordinates.targetY,
    targetPosition,
    borderRadius,
  });

  // --- Store the last valid endpoint positions in state so labels persist ---
  const [lastSourceCoords, setLastSourceCoords] = useState({
    x: adjustedSourceCoordinates.sourceX,
    y: adjustedSourceCoordinates.sourceY,
  });
  const [lastTargetCoords, setLastTargetCoords] = useState({
    x: adjustedTargetCoordinates.targetX,
    y: adjustedTargetCoordinates.targetY,
  });

  useEffect(() => {
    if (
      adjustedSourceCoordinates.sourceX !== 0 ||
      adjustedSourceCoordinates.sourceY !== 0
    ) {
      setLastSourceCoords({
        x: adjustedSourceCoordinates.sourceX,
        y: adjustedSourceCoordinates.sourceY,
      });
    }
  }, [adjustedSourceCoordinates]);

  useEffect(() => {
    if (
      adjustedTargetCoordinates.targetX !== 0 ||
      adjustedTargetCoordinates.targetY !== 0
    ) {
      setLastTargetCoords({
        x: adjustedTargetCoordinates.targetX,
        y: adjustedTargetCoordinates.targetY,
      });
    }
  }, [adjustedTargetCoordinates]);

  // --- Calculate toolbar position as the midpoint of the edge ---
  const toolbarPosition = {
    x: (adjustedSourceCoordinates.sourceX + adjustedTargetCoordinates.targetX) / 2,
    y: (adjustedSourceCoordinates.sourceY + adjustedTargetCoordinates.targetY) / 2,
  };

  // --- Handlers ---
  const handleEdgeClick = () => {
    setToolbarOpen(!toolbarOpen);
    if (edgePopoverAnchor) setEdgePopoverAnchor(null);
  };

  const handleEditIconClick = (event: React.MouseEvent<HTMLElement>) => {
    setEdgePopoverAnchor(event.currentTarget);
  };

  return (
    <>
      {/* Render the base edge */}
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd="url(#white-rhombus)"
        pointerEvents="none"
        style={{ stroke: "#000000", cursor: "pointer" }}
      />

      {/* Invisible overlay to capture pointer events */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={12}
        pointerEvents="stroke"
        onClick={handleEdgeClick}
      />

      {/* Render the toolbar if toggled */}
      {toolbarOpen && (
        <CustomEdgeToolbar
          x={toolbarPosition.x}
          y={toolbarPosition.y}
          onEditClick={handleEditIconClick}
        />
      )}

      {/* Render the popover for editing edge properties */}
      <EdgePopover
        edgeId={id}
        anchorEl={edgePopoverAnchor}
        open={Boolean(edgePopoverAnchor)}
        onClose={() => setEdgePopoverAnchor(null)}
        edgeType={edgeType}
        //targetRole={targetRole}
        onEdgeTypeChange={setEdgeType}
        onSourceRoleChange={handleSourceRoleChange}
        onSourceMultiplicityChange={handleSourceMultiplicityChange}
        onTargetRoleChange={handleTargetRoleChange}
        onTargetMultiplicityChange={handleTargetMultiplicityChange}
      />

      {/* Render labels directly on the SVG using the stored coordinates */}
      {/* Source Endpoint */}
      {sourceRole && (
        <text
          x={lastSourceCoords.x}
          y={lastSourceCoords.y - 10}
          textAnchor="middle"
          style={{ fontSize: "12px", fill: "black", userSelect: "none" }}
        >
          {sourceRole}
        </text>
      )}
      {sourceMultiplicity && (
        <text
          x={lastSourceCoords.x}
          y={lastSourceCoords.y + 15}
          textAnchor="middle"
          style={{ fontSize: "12px", fill: "black", userSelect: "none" }}
        >
          {sourceMultiplicity}
        </text>
      )}

      {/* Target Endpoint */}
      {targetRole && (
        <text
          x={lastTargetCoords.x}
          y={lastTargetCoords.y - 10}
          textAnchor="middle"
          style={{ fontSize: "12px", fill: "black", userSelect: "none" }}
        >
          {targetRole}
        </text>
      )}
      {targetMultiplicity && (
        <text
          x={lastTargetCoords.x}
          y={lastTargetCoords.y + 15}
          textAnchor="middle"
          style={{ fontSize: "12px", fill: "black", userSelect: "none" }}
        >
          {targetMultiplicity}
        </text>
      )}
    </>
  );
};
