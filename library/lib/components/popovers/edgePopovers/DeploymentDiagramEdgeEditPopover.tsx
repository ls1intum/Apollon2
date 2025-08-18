import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material"
import SwapHorizIcon from "@mui/icons-material/SwapHoriz"
import { useReactFlow } from "@xyflow/react"
import { CustomEdgeProps } from "@/edges/EdgeProps"
import { useEdgePopOver } from "@/hooks"
import { PopoverProps } from "../types"

export const DeploymentEdgeEditPopover: React.FC<PopoverProps> = ({
  elementId,
}) => {
  const { getEdge, getNode } = useReactFlow()

  const edge = getEdge(elementId)
  const { handleEdgeTypeChange, handleLabelChange, handleSwap } =
    useEdgePopOver(elementId)

  if (!edge) {
    return null
  }

  const edgeData = edge.data as CustomEdgeProps | undefined
  const sourceNode = getNode(edge.source)
  const targetNode = getNode(edge.target)
  const sourceName = (sourceNode?.data?.name as string) ?? "Source"
  const targetName = (targetNode?.data?.name as string) ?? "Target"

  const deploymentEdgeTypeOptions = [
    { value: "DeploymentAssociation", label: "Deployment Association" },
    { value: "DeploymentDependency", label: "Deployment Dependency" },
    { value: "DeploymentProvidedInterface", label: "Provided Interface" },
    { value: "DeploymentRequiredInterface", label: "Required Interface" },
  ]

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
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
          {deploymentEdgeTypeOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Connection info */}
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        {sourceName} → {targetName}
      </Typography>

      {/* Show label input only for associations */}
      {edge.type === "DeploymentAssociation" && (
        <TextField
          label="Edge Label"
          value={edgeData?.label ?? ""}
          onChange={(e) => handleLabelChange(e.target.value)}
          size="small"
          fullWidth
          placeholder="Optional label for association"
        />
      )}
    </Box>
  )
}
