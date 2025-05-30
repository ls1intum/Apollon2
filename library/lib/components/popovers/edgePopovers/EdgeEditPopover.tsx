import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material"

import { useReactFlow } from "@xyflow/react"
import { CustomEdgeProps } from "@/edges/EdgeProps"
import SwapHorizIcon from "@mui/icons-material/SwapHoriz"
import { useEdgePopOver } from "@/hooks"
import { PopoverProps } from "../types"

export const EdgeEditPopover: React.FC<PopoverProps> = ({ elementId }) => {
  const { getEdge, getNode } = useReactFlow()

  const edge = getEdge(elementId)
  const {
    handleSourceRoleChange,
    handleSourceMultiplicityChange,
    handleTargetRoleChange,
    handleTargetMultiplicityChange,
    handleEdgeTypeChange,
    handleSwap,
  } = useEdgePopOver(elementId)

  if (!edge) {
    return null
  }

  const edgeData = edge.data as CustomEdgeProps | undefined
  // Retrieve source/target node names
  const sourceNode = getNode(edge.source)
  const targetNode = getNode(edge.target)
  const sourceName = (sourceNode?.data?.name as string) ?? "Source"
  const targetName = (targetNode?.data?.name as string) ?? "Target"

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {/* Swap icon for source/target swap */}
      {handleSwap && (
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <SwapHorizIcon sx={{ cursor: "pointer" }} onClick={handleSwap} />
        </Box>
      )}

      {/* Edge type selection */}
      <FormControl fullWidth size="small">
        <InputLabel id="edge-type-label">Edge Type</InputLabel>
        <Select
          labelId="edge-type-label"
          id="edge-type-select"
          value={edge.type}
          label="Edge Type"
          onChange={(e) => handleEdgeTypeChange(e.target.value)}
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

      {/* Source subheadline */}
      <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
        {sourceName}
      </Typography>

      {/* Source Multiplicity */}
      <TextField
        label={sourceName + " Multiplicity"}
        value={edgeData?.sourceMultiplicity ?? ""}
        onChange={(e) => handleSourceMultiplicityChange(e.target.value)}
        size="small"
        fullWidth
      />

      {/* Source Role */}
      <TextField
        label={sourceName + " Role"}
        value={edgeData?.sourceRole ?? ""}
        onChange={(e) => handleSourceRoleChange(e.target.value)}
        size="small"
        fullWidth
      />

      {/* Target subheadline */}
      <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
        {targetName}
      </Typography>

      {/* Target Multiplicity */}
      <TextField
        label={targetName + " Multiplicity"}
        value={edgeData?.targetMultiplicity ?? ""}
        onChange={(e) => handleTargetMultiplicityChange(e.target.value)}
        size="small"
        fullWidth
      />

      {/* Target Role */}
      <TextField
        label={targetName + " Role"}
        value={edgeData?.targetRole ?? ""}
        onChange={(e) => handleTargetRoleChange(e.target.value)}
        size="small"
        fullWidth
      />
    </Box>
  )
}
