import { forwardRef } from "react"
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

// Modify EdgePopover to forward refs
export const EdgePopover = forwardRef<HTMLDivElement, EdgePopoverProps>(
  (
    {
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
    },
    ref
  ) => {
    if (!anchorEl || !open) {
      return null
    }

    const { getEdge } = useReactFlow()
    const edge = getEdge(edgeId)!
    const edgeData = edge.data as CustomEdgeProps

    return (
      <GenericPopover
        id={`edge-popover-${edgeId}`}
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
        style={{ width: 800 }}
      >
        <Box
          ref={ref}
          sx={{ display: "flex", flexDirection: "column", gap: 2, p: 1 }}
        >
          {onSwap && (
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <SwapHorizIcon sx={{ cursor: "pointer" }} onClick={onSwap} />
            </Box>
          )}
          <FormControl fullWidth size="small">
            <InputLabel id="edge-type-label">Edge Type</InputLabel>
            <Select
              labelId="edge-type-label"
              id="edge-type-select"
              value={edge.type}
              label="Edge Type"
              onChange={(e) => onEdgeTypeChange(e.target.value)}
            >
              <MenuItem value="ClassBidirectional">Bi-Association</MenuItem>
              <MenuItem value="ClassUnidirectional">Uni-Association</MenuItem>
              <MenuItem value="ClassAggregation">Aggregation</MenuItem>
              <MenuItem value="ClassComposition">Composition</MenuItem>
              <MenuItem value="ClassInheritance">Inheritance</MenuItem>
              <MenuItem value="ClassDependency">Dependency</MenuItem>
              <MenuItem value="ClassRealization">Realization</MenuItem>
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
)

// Add a display name for debugging
EdgePopover.displayName = "EdgePopover"
