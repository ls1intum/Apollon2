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
  
  // Determine if this is a use case diagram edge
  const isUseCaseEdge = edge.type?.startsWith('UseCase')
  
  // Retrieve source/target node names
  const sourceNode = getNode(edge.source)
  const targetNode = getNode(edge.target)
  const sourceName = (sourceNode?.data?.name as string) ?? "Source"
  const targetName = (targetNode?.data?.name as string) ?? "Target"

  // Define edge type options based on diagram type
  const getEdgeTypeOptions = () => {
    if (isUseCaseEdge) {
      return [
        { value: "UseCaseAssociation", label: "Association" },
        { value: "UseCaseInclude", label: "Include" },
        { value: "UseCaseExtend", label: "Extend" },
        { value: "UseCaseGeneralization", label: "Generalization" },
      ]
    } else {
      return [
        { value: "ClassBidirectional", label: "Bi-Association" },
        { value: "ClassUnidirectional", label: "Uni-Association" },
        { value: "ClassAggregation", label: "Aggregation" },
        { value: "ClassComposition", label: "Composition" },
        { value: "ClassInheritance", label: "Inheritance" },
        { value: "ClassDependency", label: "Dependency" },
        { value: "ClassRealization", label: "Realization" },
      ]
    }
  }

  const edgeTypeOptions = getEdgeTypeOptions()

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {/* Swap icon for source/target swap - only show for non-use case edges */}
      {handleSwap && !isUseCaseEdge && (
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
          {edgeTypeOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Only show role and multiplicity fields for class diagram edges */}
      {!isUseCaseEdge && (
        <>
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
        </>
      )}

      {/* For use case edges, show simplified info */}
      {isUseCaseEdge && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {sourceName} → {targetName}
          </Typography>
          {(edge.type === "UseCaseInclude" || edge.type === "UseCaseExtend") && (
            <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              Relationship label will be automatically displayed
            </Typography>
          )}
        </Box>
      )}
    </Box>
  )
}