import { Box, TextField, Typography, IconButton, Button } from "@mui/material"
import { useReactFlow } from "@xyflow/react"
import { CustomEdgeProps, MessageData } from "@/edges/EdgeProps"

import DeleteIcon from "@mui/icons-material/Delete"
import AddIcon from "@mui/icons-material/Add"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"

import { PopoverProps } from "../types"
import { useState, useEffect } from "react"

export const CommunicationDiagramEdgeEditPopover: React.FC<PopoverProps> = ({
  elementId,
}) => {
  const { getEdge, setEdges, getNode } = useReactFlow()
  const edge = getEdge(elementId)
  const [messages, setMessages] = useState<MessageData[]>([])
  const [newLabelInput, setNewLabelInput] = useState("")
  const [duplicateError, setDuplicateError] = useState(false)

  const sourceNode = getNode(edge?.source || "")
  const targetNode = getNode(edge?.target || "")
  const sourceName = (sourceNode?.data?.name as string) ?? "Source"
  const targetName = (targetNode?.data?.name as string) ?? "Target"

  useEffect(() => {
    if (edge?.data) {
      const edgeData = edge.data as CustomEdgeProps
      
      // Support backward compatibility - convert old labels to messages
      if (edgeData.messages) {
        setMessages(edgeData.messages)
      } else if (edgeData.labels) {
        const convertedMessages = edgeData.labels.map(label => ({
          text: label,
          direction: "forward" as const
        }))
        setMessages(convertedMessages)
      }
    }
  }, [edge])

  const handleMessagesChange = (newMessages: MessageData[]) => {
    setMessages(newMessages)
    if (edge) {
      // Update both messages and labels for backward compatibility
      const labels = newMessages.map(msg => msg.text)
      setEdges((edges) =>
        edges.map((e) =>
          e.id === elementId
            ? {
                ...e,
                data: {
                  ...e.data,
                  messages: newMessages,
                  labels: labels, // Keep for backward compatibility
                },
              }
            : e
        )
      )
    }
  }

  const handleAddMessage = () => {
    if (newLabelInput.trim()) {
      // Check if message text already exists
      const trimmedInput = newLabelInput.trim()
      const messageExists = messages.some(msg => msg.text.toLowerCase() === trimmedInput.toLowerCase())
      
      if (messageExists) {
        // Set error state to show duplicate warning
        setDuplicateError(true)
        console.warn(`Message "${trimmedInput}" already exists`)
        return
      }
      
      // Clear any previous error
      setDuplicateError(false)
      
      const newMessage: MessageData = {
        text: trimmedInput,
        direction: "forward" // Default to forward direction
      }
      const newMessages = [...messages, newMessage]
      handleMessagesChange(newMessages)
      setNewLabelInput("")
    }
  }

  // Clear duplicate error when input changes
  const handleInputChange = (value: string) => {
    setNewLabelInput(value)
    if (duplicateError) {
      // Check if the current input would still be a duplicate
      const trimmedValue = value.trim()
      const wouldBeDuplicate = trimmedValue && messages.some(msg => 
        msg.text.toLowerCase() === trimmedValue.toLowerCase()
      )
      if (!wouldBeDuplicate) {
        setDuplicateError(false)
      }
    }
  }

  const handleDeleteMessage = (index: number) => {
    const newMessages = messages.filter((_, i) => i !== index)
    handleMessagesChange(newMessages)
  }

  const handleMessageTextUpdate = (index: number, value: string) => {
    // Always allow the update for real-time typing, validation is visual only
    const newMessages = [...messages]
    newMessages[index] = { ...newMessages[index], text: value }
    handleMessagesChange(newMessages)
  }

  const handleMessageDirectionToggle = (index: number) => {
    const newMessages = [...messages]
    newMessages[index] = {
      ...newMessages[index],
      direction: newMessages[index].direction === "forward" ? "backward" : "forward"
    }
    handleMessagesChange(newMessages)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddMessage()
    }
  }

  if (!edge) {
    return null
  }

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 1, minWidth: 300 }}
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

      {/* Direction Legend */}
      <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <ArrowForwardIcon fontSize="small" />
          <Typography variant="caption">
            {sourceName} → {targetName}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <ArrowBackIcon fontSize="small" />
          <Typography variant="caption">
            {targetName} → {sourceName}
          </Typography>
        </Box>
      </Box>

      {/* Existing Messages */}
      {messages.map((message, index) => {
        // Check if this message text would be a duplicate of any other message
        const isDuplicateText = messages.some((msg, i) => 
          i !== index && msg.text.toLowerCase() === message.text.toLowerCase() && message.text.trim() !== ""
        )
        
        return (
          <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Direction Toggle Button */}
            <IconButton
              size="small"
              onClick={() => handleMessageDirectionToggle(index)}
              color={message.direction === "forward" ? "primary" : "secondary"}
              title={`Direction: ${
                message.direction === "forward" 
                  ? `${sourceName} → ${targetName}` 
                  : `${targetName} → ${sourceName}`
              }`}
            >
              {message.direction === "forward" ? (
                <ArrowForwardIcon fontSize="small" />
              ) : (
                <ArrowBackIcon fontSize="small" />
              )}
            </IconButton>
            
            {/* Message Text Field */}
            <TextField
              value={message.text}
              onChange={(e) => handleMessageTextUpdate(index, e.target.value)}
              size="small"
              fullWidth
              placeholder={`Message ${index + 1}`}
              error={isDuplicateText}
              helperText={isDuplicateText ? "Duplicate message" : ""}
            />
            
            {/* Delete Button */}
            <IconButton
              size="small"
              onClick={() => handleDeleteMessage(index)}
              color="error"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        )
      })}

      {/* Add new message input */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <TextField
          value={newLabelInput}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyPress={handleKeyPress}
          size="small"
          fullWidth
          placeholder="Enter message and press Enter"
          error={duplicateError}
          helperText={duplicateError ? "This message already exists" : ""}
        />
        <IconButton 
          size="small" 
          onClick={handleAddMessage} 
          color="primary"
          disabled={!newLabelInput.trim() || duplicateError}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>

      <Button
        variant="outlined"
        size="small"
        onClick={handleAddMessage}
        disabled={!newLabelInput.trim() || duplicateError}
        sx={{ mt: 1 }}
      >
        Add Message
      </Button>
    </Box>
  )
}
