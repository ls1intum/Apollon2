import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material"

import { useReactFlow } from "@xyflow/react"
import SwapHorizIcon from "@mui/icons-material/SwapHoriz"
import { useEdgePopOver } from "@/hooks"
import { PopoverProps } from "../types"

export const ComponentEdgeEditPopover: React.FC<PopoverProps> = ({
  elementId,
}) => {
  const { getEdge, getNode } = useReactFlow()

  const edge = getEdge(elementId)
  const { handleEdgeTypeChange, handleSwap } = useEdgePopOver(elementId)

  if (!edge) {
    return null
  }
  
  const sourceNode = getNode(edge.source)
  const targetNode = getNode(edge.target)
  const sourceName = (sourceNode?.data?.name as string) ?? "Source"
  const targetName = (targetNode?.data?.name as string) ?? "Target"

  const componentEdgeTypeOptions = [
    { value: "ComponentDependency", label: "Dependency" },
    { value: "ComponentProvidedInterface", label: "Provided Interface" },
    { value: "ComponentRequiredInterface", label: "Required Interface" },
  ]

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {handleSwap && (
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <SwapHorizIcon sx={{ cursor: "pointer" }} onClick={handleSwap} />
        </Box>
      )}
      
      <FormControl fullWidth size="small">
        <InputLabel id="edge-type-label">Edge Type</InputLabel>
        <Select
          labelId="edge-type-label"
          id="edge-type-select"
          value={edge.type}
          label="Edge Type"
          onChange={(e) => handleEdgeTypeChange(e.target.value)}
        >
          {componentEdgeTypeOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        {sourceName} → {targetName}
      </Typography>
    </Box>
  )
}