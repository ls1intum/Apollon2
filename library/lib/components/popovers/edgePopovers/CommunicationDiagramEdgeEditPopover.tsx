import { Box, TextField, Typography, IconButton, Button } from "@mui/material"
import { useReactFlow } from "@xyflow/react"
import { CustomEdgeProps } from "@/edges/EdgeProps"

import DeleteIcon from "@mui/icons-material/Delete"
import AddIcon from "@mui/icons-material/Add"

import { PopoverProps } from "../types"
import { useState, useEffect } from "react"

export const CommunicationDiagramEdgeEditPopover: React.FC<PopoverProps> = ({
  elementId,
}) => {
  const { getEdge, setEdges } = useReactFlow()
  const edge = getEdge(elementId)
  const [labels, setLabels] = useState<string[]>([])
  const [newLabelInput, setNewLabelInput] = useState("")

  useEffect(() => {
    if (edge?.data) {
      const edgeData = edge.data as CustomEdgeProps & { labels?: string[] }
      setLabels(edgeData.labels || [])
    }
  }, [edge])

  const handleLabelsChange = (newLabels: string[]) => {
    setLabels(newLabels)
    if (edge) {
      setEdges((edges) =>
        edges.map((e) =>
          e.id === elementId
            ? {
                ...e,
                data: {
                  ...e.data,
                  labels: newLabels,
                },
              }
            : e
        )
      )
    }
  }

  const handleAddLabel = () => {
    if (newLabelInput.trim()) {
      const newLabels = [...labels, newLabelInput.trim()]
      handleLabelsChange(newLabels)
      setNewLabelInput("")
    }
  }

  const handleDeleteLabel = (index: number) => {
    const newLabels = labels.filter((_, i) => i !== index)
    handleLabelsChange(newLabels)
  }

  const handleLabelUpdate = (index: number, value: string) => {
    const newLabels = [...labels]
    newLabels[index] = value
    handleLabelsChange(newLabels)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddLabel()
    }
  }

  if (!edge) {
    return null
  }

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 1, minWidth: 250 }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          Communication Link
        </Typography>
      </div>

      {/* Existing Labels */}
      {labels.map((label, index) => (
        <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TextField
            value={label}
            onChange={(e) => handleLabelUpdate(index, e.target.value)}
            size="small"
            fullWidth
            placeholder={`Message ${index + 1}`}
          />
          <IconButton
            size="small"
            onClick={() => handleDeleteLabel(index)}
            color="error"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}

      {/* Add new label input */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <TextField
          value={newLabelInput}
          onChange={(e) => setNewLabelInput(e.target.value)}
          onKeyPress={handleKeyPress}
          size="small"
          fullWidth
          placeholder="Enter message number and press Enter"
        />
        <IconButton size="small" onClick={handleAddLabel} color="primary">
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>

      <Button
        variant="outlined"
        size="small"
        onClick={handleAddLabel}
        disabled={!newLabelInput.trim()}
        sx={{ mt: 1 }}
      >
        Add Message
      </Button>
    </Box>
  )
}
