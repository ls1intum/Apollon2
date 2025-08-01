import { Box, TextField, Typography } from "../../ui"
import { Select, MenuItem } from "../../ui"

import { useReactFlow } from "@xyflow/react"
import { CustomEdgeProps } from "@/edges/EdgeProps"
import { SwapHorizIcon } from "../../Icon"
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
        <Box style={{ display: "flex", justifyContent: "flex-end" }}>
          <SwapHorizIcon style={{ cursor: "pointer" }} onClick={handleSwap} />
        </Box>
      )}

      {/* Edge type selection */}
      <Select
        fullWidth
        size="small"
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

      {/* Source subheadline */}
      <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
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
      <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
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
