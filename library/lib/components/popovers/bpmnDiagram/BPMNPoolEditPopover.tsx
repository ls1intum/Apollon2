import { useState } from "react"
import {
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  Divider,
} from "@mui/material"
import { Add, Delete } from "@mui/icons-material"
import { PopoverProps } from "../types"
import { useDiagramStore } from "@/store/context"
import { useShallow } from "zustand/shallow"
import { Node } from "@xyflow/react"
import { BPMNPoolProps } from "@/types"

interface Swimlane {
  id: string
  name: string
}

export const BPMNPoolEditPopover = ({ elementId }: PopoverProps) => {
  const { nodes, setNodes } = useDiagramStore(
    useShallow((state) => ({
      nodes: state.nodes,
      setNodes: state.setNodes,
    }))
  )

  const poolNode = nodes.find((node) => node.id === elementId) as Node<
    BPMNPoolProps & { swimlanes?: Swimlane[] }
  >

  if (!poolNode) {
    return null
  }

  // Get swimlanes from the pool's internal data
  const swimlanes = poolNode.data.swimlanes || []
  const [poolName, setPoolName] = useState(poolNode.data.name)
  const [newSwimlane, setNewSwimlane] = useState("")

  const handlePoolNameChange = () => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === elementId) {
          return {
            ...node,
            data: { ...node.data, name: poolName },
          }
        }
        return node
      })
    )
  }

  const updatePoolSwimlanes = (newSwimlanes: Swimlane[]) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === elementId) {
          // Calculate new pool height based on swimlanes
          const minHeight = 120
          const swimlaneHeight = 100
          const newHeight =
            newSwimlanes.length > 0
              ? Math.max(minHeight, newSwimlanes.length * swimlaneHeight)
              : minHeight

          return {
            ...node,
            data: {
              ...node.data,
              swimlanes: newSwimlanes,
            },
            style: {
              ...node.style,
              height: newHeight,
            },
            measured: {
              ...node.measured,
              height: newHeight,
            },
          }
        }
        return node
      })
    )
  }

  const addSwimlane = () => {
    if (!newSwimlane.trim()) return

    const newId = `swimlane-${Date.now()}`
    const newSwimlanes = [...swimlanes, { id: newId, name: newSwimlane.trim() }]

    updatePoolSwimlanes(newSwimlanes)
    setNewSwimlane("")
  }

  const removeSwimlane = (swimlaneId: string) => {
    const newSwimlanes = swimlanes.filter((s) => s.id !== swimlaneId)
    updatePoolSwimlanes(newSwimlanes)
  }

  const updateSwimlaneName = (swimlaneId: string, name: string) => {
    const newSwimlanes = swimlanes.map((s) =>
      s.id === swimlaneId ? { ...s, name } : s
    )
    updatePoolSwimlanes(newSwimlanes)
  }

  return (
    <Box sx={{ width: 300, padding: 2 }}>
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          label="Pool Name"
          value={poolName}
          onChange={(e) => setPoolName(e.target.value)}
          onBlur={handlePoolNameChange}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handlePoolNameChange()
            }
          }}
          variant="outlined"
          size="small"
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: "bold" }}>
        Lanes ({swimlanes.length})
      </Typography>

      {swimlanes.map((swimlane) => (
        <Box
          key={swimlane.id}
          sx={{ display: "flex", alignItems: "center", mb: 1 }}
        >
          <TextField
            fullWidth
            value={swimlane.name}
            onChange={(e) => updateSwimlaneName(swimlane.id, e.target.value)}
            variant="outlined"
            size="small"
            sx={{ mr: 1 }}
          />
          <IconButton
            size="small"
            onClick={() => removeSwimlane(swimlane.id)}
            color="error"
          >
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      ))}

      <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
        <TextField
          fullWidth
          placeholder="New lane name"
          value={newSwimlane}
          onChange={(e) => setNewSwimlane(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              addSwimlane()
            }
          }}
          variant="outlined"
          size="small"
          sx={{ mr: 1 }}
        />
        <Button
          variant="contained"
          onClick={addSwimlane}
          disabled={!newSwimlane.trim()}
          startIcon={<Add />}
          size="small"
        >
          Add
        </Button>
      </Box>

      {swimlanes.length === 0 && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 2, fontStyle: "italic", textAlign: "center" }}
        >
          Add lanes to organize your pool content
        </Typography>
      )}
    </Box>
  )
}
