import { Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material"
import { EdgeStyleEditor, TextField, Typography } from "@/components/ui"
import { useReactFlow } from "@xyflow/react"
import { CustomEdgeProps } from "@/edges/EdgeProps"
import { SwapHorizIcon } from "@/components/Icon"
import { useEdgePopOver } from "@/hooks"
import { PopoverProps } from "../types"

export const EdgeEditPopover: React.FC<PopoverProps> = ({ elementId }) => {
  const { getEdge, getNode, updateEdgeData } = useReactFlow()

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
  const sourceNode = getNode(edge.source)
  const targetNode = getNode(edge.target)
  const sourceName = (sourceNode?.data?.name as string) ?? "Source"
  const targetName = (targetNode?.data?.name as string) ?? "Target"

  const getEdgeTypeOptions = () => {
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

  const edgeTypeOptions = getEdgeTypeOptions()

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <EdgeStyleEditor
        edgeData={edgeData}
        handleDataFieldUpdate={(key, value) =>
          updateEdgeData(elementId, { ...edge.data, [key]: value })
        }
        label="Edge Type"
        sideElements={[
          handleSwap && (
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <SwapHorizIcon
                style={{ cursor: "pointer" }}
                onClick={handleSwap}
              />
            </Box>
          ),
        ]}
      />

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

      {
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
      }
    </Box>
  )
}
