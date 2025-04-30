import React, { useState, KeyboardEvent, ChangeEvent } from "react"
import { Box, TextField, Typography } from "@mui/material"
import { generateUUID } from "@/utils"
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined"
import { useDiagramStore } from "@/store"
import { useShallow } from "zustand/shallow"
import { ClassNodeProps } from "@/types"

interface Props {
  nodeId: string
}

export const EditableAttributeList: React.FC<Props> = ({ nodeId }) => {
  const { nodes, setNodes } = useDiagramStore(
    useShallow((state) => ({ setNodes: state.setNodes, nodes: state.nodes }))
  )
  const [newItem, setNewItem] = useState("")
  const nodeData = nodes.find((node) => node.id === nodeId)
    ?.data as ClassNodeProps
  const attributes = nodeData.attributes

  const handleAttributeChange = (id: string, newName: string) => {
    const updatedItems = attributes.map((item) =>
      item.id === id ? { ...item, name: newName } : item
    )
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              attributes: updatedItems,
            },
          }
        }
        return node
      })
    )
  }

  const handleItemDelete = (id: string) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              attributes: attributes.filter((item) => item.id !== id),
            },
            height: node.height! - 30,
            measured: {
              ...node.measured,
              height: node.height! - 30,
            },
          }
        }
        return node
      })
    )
  }

  const handleAddItem = () => {
    if (newItem.trim() === "") return
    const newAttribute = { id: generateUUID(), name: newItem }
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              attributes: [...attributes, newAttribute],
            },
            height: node.height! + 30,
            measured: {
              ...node.measured,
              height: node.height! + 30,
            },
          }
        }
        return node
      })
    )

    setNewItem("")
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleAddItem()
    }
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
      <Typography variant="h6">Attributes</Typography>
      {attributes.map((item) => (
        <Box
          key={item.id}
          sx={{
            display: "flex",
            gap: 0.5,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TextField
            size="small"
            value={item.name}
            fullWidth
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleAttributeChange(item.id, e.target.value)
            }
            sx={{ backgroundColor: "#fff" }}
          />
          <DeleteOutlineOutlinedIcon
            sx={{ cursor: "pointer", width: 16, height: 16 }}
            onClick={() => handleItemDelete(item.id)}
          />
        </Box>
      ))}
      <TextField
        size="small"
        fullWidth
        variant="outlined"
        placeholder="+ Add attribute"
        value={newItem}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setNewItem(e.target.value)
        }
        onBlur={() => {
          if (newItem.trim() === "") {
            setNewItem("")
          } else {
            handleAddItem()
          }
        }}
        onFocus={(event) => console.log("focus", event)}
        onKeyDown={handleKeyDown}
        sx={{
          backgroundColor: "#fff",
        }}
      />
    </Box>
  )
}
