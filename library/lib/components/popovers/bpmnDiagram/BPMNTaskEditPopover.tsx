import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material"
import { TextField } from "@/components/ui"
import { useReactFlow } from "@xyflow/react"
import { PopoverProps } from "../types"
import { BPMNMarkerType, BPMNTaskType } from "@/types"

export const BPMNTaskEditPopover: React.FC<PopoverProps> = ({ elementId }) => {
  const { getNode, updateNodeData } = useReactFlow()
  const node = getNode(elementId)
  if (!node) return null

  const data = node.data as {
    name?: string
    taskType?: BPMNTaskType
    marker?: BPMNMarkerType
  }

  const handleNameChange = (value: string) =>
    updateNodeData(elementId, { name: value })
  const handleTaskTypeChange = (value: BPMNTaskType) =>
    updateNodeData(elementId, { taskType: value })
  const handleMarkerChange = (value: BPMNMarkerType) =>
    updateNodeData(elementId, { marker: value })

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <TextField
        size="small"
        label="Name"
        value={data.name ?? ""}
        onChange={(e) => handleNameChange(e.target.value)}
      />

      <FormControl fullWidth size="small">
        <InputLabel id="bpmn-task-type-label">Task Type</InputLabel>
        <Select
          labelId="bpmn-task-type-label"
          id="bpmn-task-type-select"
          value={data.taskType ?? "default"}
          label="Task Type"
          onChange={(e) => handleTaskTypeChange(e.target.value as BPMNTaskType)}
        >
          <MenuItem value="default">Default</MenuItem>
          <MenuItem value="user">User</MenuItem>
          <MenuItem value="send">Send</MenuItem>
          <MenuItem value="receive">Receive</MenuItem>
          <MenuItem value="manual">Manual</MenuItem>
          <MenuItem value="business-rule">Business Rule</MenuItem>
          <MenuItem value="script">Script</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth size="small">
        <InputLabel id="bpmn-task-marker-label">Marker</InputLabel>
        <Select
          labelId="bpmn-task-marker-label"
          id="bpmn-task-marker-select"
          value={data.marker ?? "none"}
          label="Marker"
          onChange={(e) => handleMarkerChange(e.target.value as BPMNMarkerType)}
        >
          <MenuItem value="none">None</MenuItem>
          <MenuItem value="parallel multi instance">
            Parallel multi instance
          </MenuItem>
          <MenuItem value="sequential multi instance">
            Sequential multi instance
          </MenuItem>
          <MenuItem value="loop">Loop</MenuItem>
        </Select>
      </FormControl>
    </Box>
  )
}
