import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material"
import { useReactFlow } from "@xyflow/react"
import { PopoverProps } from "../types"
import { BPMNStartEventType } from "@/types"

export const BPMNStartEventEditPopover: React.FC<PopoverProps> = ({
  elementId,
}) => {
  const { getNode, updateNodeData } = useReactFlow()
  const node = getNode(elementId)
  if (!node) return null

  const data = node.data as { name?: string; eventType?: BPMNStartEventType }

  const handleNameChange = (value: string) =>
    updateNodeData(elementId, { name: value })
  const handleTypeChange = (value: BPMNStartEventType) =>
    updateNodeData(elementId, { eventType: value })

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <TextField
        size="small"
        label="Name"
        value={data.name ?? ""}
        onChange={(e) => handleNameChange(e.target.value)}
      />
      <FormControl fullWidth size="small">
        <InputLabel id="bpmn-start-type-label">Start Type</InputLabel>
        <Select
          labelId="bpmn-start-type-label"
          id="bpmn-start-type-select"
          value={data.eventType ?? "default"}
          label="Start Type"
          onChange={(e) =>
            handleTypeChange(e.target.value as BPMNStartEventType)
          }
        >
          <MenuItem value="default">Default</MenuItem>
          <MenuItem value="message">Message</MenuItem>
          <MenuItem value="timer">Timer</MenuItem>
          <MenuItem value="conditional">Conditional</MenuItem>
          <MenuItem value="signal">Signal</MenuItem>
        </Select>
      </FormControl>
    </Box>
  )
}
