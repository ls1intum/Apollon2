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
import { useEdgePopOver } from "@/hooks"
import { PopoverProps } from "../types"

export const UseCaseEdgeEditPopover: React.FC<PopoverProps> = ({ elementId }) => {
  const { getEdge, getNode } = useReactFlow()

  const edge = getEdge(elementId)
  const {
    handleEdgeTypeChange,
    handleLabelChange, // Use existing handleLabelChange
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

  // Use case edge type options
  const useCaseEdgeTypeOptions = [
    { value: "UseCaseAssociation", label: "Association" },
    { value: "UseCaseInclude", label: "Include" },
    { value: "UseCaseExtend", label: "Extend" },
    { value: "UseCaseGeneralization", label: "Generalization" },
  ]

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
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
          {useCaseEdgeTypeOptions.map((option) => (
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
      {edge.type === "UseCaseAssociation" && (
        <TextField
          label="Edge Label"
          value={edgeData?.label ?? ""}
          onChange={(e) => handleLabelChange(e.target.value)}
          size="small"
          fullWidth
          placeholder="Optional label for association"
        />
      )}
      
      {/* Info for include/extend relationships */}
      {(edge.type === "UseCaseInclude" || edge.type === "UseCaseExtend") && (
        <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          Relationship label will be automatically displayed on the edge
        </Typography>
      )}

      {/* Info for generalization */}
      {edge.type === "UseCaseGeneralization" && (
        <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          Generalization relationship (inheritance arrow)
        </Typography>
      )}
    </Box>
  )
}