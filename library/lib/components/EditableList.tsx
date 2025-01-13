import React, { useState, KeyboardEvent, ChangeEvent } from "react"
import { Box, TextField, Typography } from "@mui/material"
import { generateUUID } from "@/utils"
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined"

interface EditableListProps {
  title: string
  items: { id: string; name: string }[]
  onItemsChange: (newItems: { id: string; name: string }[]) => void
  placeholder: string
}

export const EditableList: React.FC<EditableListProps> = ({
  title,
  items,
  onItemsChange,
  placeholder,
}) => {
  const [newItem, setNewItem] = useState("")

  const handleItemChange = (id: string, newName: string) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, name: newName } : item
    )
    onItemsChange(updatedItems)
  }

  const handleItemDelete = (id: string) => {
    const updatedItems = items.filter((item) => item.id !== id)
    onItemsChange(updatedItems)
  }

  const handleAddItem = () => {
    if (newItem.trim() === "") return
    onItemsChange([...items, { id: generateUUID(), name: newItem }])
    setNewItem("")
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleAddItem()
    }
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
      <Typography variant="h6">{title}</Typography>
      {items.map((item) => (
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
              handleItemChange(item.id, e.target.value)
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
        placeholder={placeholder}
        value={newItem}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setNewItem(e.target.value)
        }
        onKeyDown={handleKeyDown}
        sx={{
          backgroundColor: "#fff",
        }}
      />
    </Box>
  )
}
