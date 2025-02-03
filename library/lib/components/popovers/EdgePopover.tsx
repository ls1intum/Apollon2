
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,

} from "@mui/material";
import { GenericPopover } from "./GenericPopover";
import { useReactFlow } from "@xyflow/react"
import { EdgeCustomProps } from "@/edges/AggregationEdge";

interface EdgePopoverProps {
  edgeId: string;
  anchorEl: HTMLElement | SVGSVGElement | null;
  open: boolean;
  onClose: () => void;
  edgeType: string;
  // sourceMultiplicity: string;
  // targetMultiplicity: string;
  // sourceRole: string;
  // targetRole: string;
  onEdgeTypeChange: (newEdgeType: string) => void;
  onSourceMultiplicityChange: (newMultiplicity: string) => void;
  onTargetMultiplicityChange: (newMultiplicity: string) => void;
  onSourceRoleChange: (newRole: string) => void;
  onTargetRoleChange: (newRole: string) => void;
}

export function EdgePopover({
  edgeId,
  anchorEl,
  open,
  onClose,
  edgeType,
  //sourceMultiplicity,
  //targetMultiplicity,
  //sourceRole,
  //targetRole,
  onEdgeTypeChange,
  onSourceMultiplicityChange,
  onTargetMultiplicityChange,
  onSourceRoleChange,
  onTargetRoleChange,
}: EdgePopoverProps) {
  // Only render the popover if there is an anchor element and open is true
  if (!anchorEl || !open) {
    return null;
  }
  
  const { getEdge, } = useReactFlow()

    const edge = getEdge(edgeId)!
    console.log(edge, edgeId, edge.data);
    const edgeData= edge.data as EdgeCustomProps

  
  return (
    <GenericPopover
      id={`edge-popover-${edgeId}`}
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      // You can adjust the width or any additional styles here
      style={{ width: 300 }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 1 }}>
        {/* Edge Type Selection Dropdown */}
        <FormControl fullWidth size="small">
          <InputLabel id="edge-type-label">Edge Type</InputLabel>
          <Select
            labelId="edge-type-label"
            id="edge-type-select"
            value={edgeType}
            label="Edge Type"
            onChange={(e) => onEdgeTypeChange(e.target.value)}
          >
            <MenuItem value="Association">Association</MenuItem>
            <MenuItem value="Aggregation">Aggregation</MenuItem>
            <MenuItem value="Composition">Composition</MenuItem>
            <MenuItem value="Inheritance">Inheritance</MenuItem>
          </Select>
        </FormControl>

        {/* Source Fields */}
        <TextField
          label="Source Multiplicity"
          value={edgeData.sourceMultiplicity}
          onChange={(e) => onSourceMultiplicityChange(e.target.value)}
          size="small"
          fullWidth
        />
        <TextField
          label="Source Role"
          value={edgeData.sourceRole}
          onChange={(e) => onSourceRoleChange(e.target.value)}
          size="small"
          fullWidth
        />

        {/* Target Fields */}
        <TextField
          label="Target Multiplicity"
          value={edgeData.targetMultiplicity}
          onChange={(e) => onTargetMultiplicityChange(e.target.value)}
          size="small"
          fullWidth
        />
        <TextField
          label="Target Role"
          value={edgeData.targetRole}
          onChange={(e) => onTargetRoleChange(e.target.value)}
          size="small"
          fullWidth
        />
      </Box>
    </GenericPopover>
  );
}
