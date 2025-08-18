import { Box, TextField, Typography } from "@mui/material"
import { PopoverProps } from "../types"
import { useReactFlow } from "@xyflow/react"

export const SfcEditPopover: React.FC<PopoverProps> = ({ elementId }) => {
  const { getNode, updateNodeData } = useReactFlow()
  const node = getNode(elementId)
  if (!node) return null

  const data = (node.data || {}) as Record<string, unknown>
  const name = (data.name as string) ?? ""

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
        Edit
      </Typography>

      <TextField
        label="Name"
        value={name}
        onChange={(e) => updateNodeData(elementId, { name: e.target.value })}
        size="small"
        fullWidth
      />
    </Box>
  )
}
