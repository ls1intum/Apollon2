import React, { useState, KeyboardEvent, ChangeEvent } from "react"
import { Box } from "@mui/material"
import { TextField, Typography } from "@/components/ui"
import { generateUUID } from "@/utils"
import { useDiagramStore } from "@/store"
import { useShallow } from "zustand/shallow"
import { SfcActionTableProps, SfcActionRow } from "@/types"
import { PopoverProps } from "../types"
import { DEFAULT_ATTRIBUTE_HEIGHT } from "@/constants"
import { DeleteIcon } from "@/components/Icon"

export const SfcActionTableEditPopover: React.FC<PopoverProps> = ({
  elementId,
}) => {
  const { nodes, setNodes } = useDiagramStore(
    useShallow((state) => ({ setNodes: state.setNodes, nodes: state.nodes }))
  )
  const [newIdentifier, setNewIdentifier] = useState("")
  const [newDescription, setNewDescription] = useState("")

  const nodeData = nodes.find((node) => node.id === elementId)
    ?.data as SfcActionTableProps
  const actionRows = nodeData?.actionRows || []

  const handleRowChange = (
    id: string,
    field: "identifier" | "description",
    newValue: string
  ) => {
    const updatedRows = actionRows.map((row) =>
      row.id === id ? { ...row, [field]: newValue } : row
    )
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === elementId) {
          return {
            ...node,
            data: {
              ...node.data,
              actionRows: updatedRows,
            },
          }
        }
        return node
      })
    )
  }

  const handleRowDelete = (id: string) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === elementId) {
          return {
            ...node,
            data: {
              ...node.data,
              actionRows: actionRows.filter((row) => row.id !== id),
            },
            height: node.height! - DEFAULT_ATTRIBUTE_HEIGHT,
            measured: {
              ...node.measured,
              height: node.height! - DEFAULT_ATTRIBUTE_HEIGHT,
            },
          }
        }
        return node
      })
    )
  }

  const handleAddRow = () => {
    if (newIdentifier.trim() === "" && newDescription.trim() === "") return

    const newRow: SfcActionRow = {
      id: generateUUID(),
      identifier: newIdentifier.trim(),
      description: newDescription.trim(),
    }

    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === elementId) {
          return {
            ...node,
            data: {
              ...node.data,
              actionRows: [...actionRows, newRow],
            },
            height: node.height! + DEFAULT_ATTRIBUTE_HEIGHT,
            measured: {
              ...node.measured,
              height: node.height! + DEFAULT_ATTRIBUTE_HEIGHT,
            },
          }
        }
        return node
      })
    )

    setNewIdentifier("")
    setNewDescription("")
  }

  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement | HTMLDivElement>,
    field: "identifier" | "description"
  ) => {
    if (event.key === "Enter") {
      if (field === "identifier") {
        // Move focus to description field
        const descInput = document.querySelector(
          '[data-field="description"][data-new="true"]'
        ) as HTMLInputElement
        descInput?.focus()
      } else {
        // Add the row
        handleAddRow()
      }
    }
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
      <Typography variant="h6">Actions</Typography>
      {actionRows.map((row) => (
        <Box
          key={row.id}
          sx={{
            display: "flex",
            gap: 0.5,
            alignItems: "center",
          }}
        >
          <TextField
            size="small"
            value={row.identifier}
            placeholder="ID"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleRowChange(row.id, "identifier", e.target.value)
            }
            sx={{ width: "60px" }}
          />
          <TextField
            size="small"
            value={row.description}
            placeholder="Description"
            fullWidth
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleRowChange(row.id, "description", e.target.value)
            }
          />
          <DeleteIcon
            width={16}
            height={16}
            style={{ cursor: "pointer" }}
            onClick={() => handleRowDelete(row.id)}
          />
        </Box>
      ))}

      <Box
        sx={{
          display: "flex",
          gap: 0.5,
          alignItems: "center",
        }}
      >
        <TextField
          size="small"
          placeholder="ID"
          value={newIdentifier}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setNewIdentifier(e.target.value)
          }
          onBlur={() => {
            if (newIdentifier.trim() === "" && newDescription.trim() === "") {
              setNewIdentifier("")
            } else if (
              newIdentifier.trim() !== "" &&
              newDescription.trim() !== ""
            ) {
              handleAddRow()
            }
          }}
          onKeyDown={(e) => handleKeyDown(e, "identifier")}
          data-field="identifier"
          data-new="true"
          sx={{
            backgroundColor: "#fff",
            width: "60px",
          }}
        />
        <TextField
          size="small"
          fullWidth
          placeholder="+ Add action description"
          value={newDescription}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setNewDescription(e.target.value)
          }
          onBlur={() => {
            if (newIdentifier.trim() === "" && newDescription.trim() === "") {
              setNewDescription("")
            } else if (
              newIdentifier.trim() !== "" &&
              newDescription.trim() !== ""
            ) {
              handleAddRow()
            }
          }}
          onKeyDown={(e) => handleKeyDown(e, "description")}
          data-field="description"
          data-new="true"
          sx={{
            backgroundColor: "#fff",
          }}
        />
      </Box>
    </Box>
  )
}
