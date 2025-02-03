import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material"
import { GenericPopover } from "./GenericPopover"
import { useReactFlow } from "@xyflow/react"
import { CustomEdgeProps } from "@/edges/EdgeProps"
import SwapHorizIcon from "@mui/icons-material/SwapHoriz"

interface EdgePopoverProps {
  edgeId: string
  anchorEl: HTMLElement | SVGSVGElement | null
  open: boolean
  onClose: () => void
  onEdgeTypeChange: (newEdgeType: string) => void
  onSourceMultiplicityChange: (newMultiplicity: string) => void
  onTargetMultiplicityChange: (newMultiplicity: string) => void
  onSourceRoleChange: (newRole: string) => void
  onTargetRoleChange: (newRole: string) => void
  onSwap: () => void
}

export function EdgePopover({
  edgeId,
  anchorEl,
  open,
  onClose,
  onEdgeTypeChange,
  onSourceMultiplicityChange,
  onTargetMultiplicityChange,
  onSourceRoleChange,
  onTargetRoleChange,
  onSwap,
}: EdgePopoverProps) {
  if (!anchorEl || !open) {
    return null
  }

  const { getEdge } = useReactFlow()

  const edge = getEdge(edgeId)!
  console.log("POPOVER", edge, edgeId, edge.data)
  const edgeData = edge.data as CustomEdgeProps

  return (
    <GenericPopover
      id={`edge-popover-${edgeId}`}
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      // You can adjust the width or any additional styles here
      style={{ width: 800 }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 1 }}>
        {/* Swap Icon at the upper part of the menu */}
        {onSwap && (
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <SwapHorizIcon
              sx={{ cursor: "pointer" }}
              onClick={() => onSwap()}
            />
          </Box>
        )}
        {/* Edge Type Selection Dropdown */}
        <FormControl fullWidth size="small">
          <InputLabel id="edge-type-label">Edge Type</InputLabel>
          <Select
            labelId="edge-type-label"
            id="edge-type-select"
            value={edge.type}
            label="Edge Type"
            onChange={(e) => onEdgeTypeChange(e.target.value)}
          >
            <MenuItem value="biassociation">Bi-Association</MenuItem>
            <MenuItem value="uniassociation">Uni-Association</MenuItem>
            <MenuItem value="aggregation">Aggregation</MenuItem>
            <MenuItem value="composition">Composition</MenuItem>
            <MenuItem value="inheritance">Inheritance</MenuItem>
            <MenuItem value="dependency">Dependency</MenuItem>
            <MenuItem value="realization">Realization</MenuItem>
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
  )
}
