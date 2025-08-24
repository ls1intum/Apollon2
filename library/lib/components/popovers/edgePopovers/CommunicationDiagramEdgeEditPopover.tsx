import { Box, TextField, Typography, IconButton } from "@mui/material"
import { useReactFlow } from "@xyflow/react"
import { CustomEdgeProps, MessageData } from "@/edges/EdgeProps"
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined"
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
      if (edgeData.messages) {
        setMessages(edgeData.messages)
      } else if (edgeData.labels) {
        const convertedMessages = edgeData.labels.map((label) => ({
          text: label,
          direction: "forward" as const,
        }))
        setMessages(convertedMessages)
      }
    }
  }, [edge])

  const handleMessagesChange = (newMessages: MessageData[]) => {
    setMessages(newMessages)
    if (edge) {
      const labels = newMessages.map((msg) => msg.text)
      setEdges((edges) =>
        edges.map((e) =>
          e.id === elementId
            ? {
                ...e,
                data: {
                  ...e.data,
                  messages: newMessages,
                  labels: labels,
                },
              }
            : e
        )
      )
    }
  }

  const handleAddMessage = () => {
    if (newLabelInput.trim()) {
      const trimmedInput = newLabelInput.trim()
      const messageExists = messages.some(
        (msg) => msg.text.toLowerCase() === trimmedInput.toLowerCase()
      )

      if (messageExists) {
        setDuplicateError(true)
        console.warn(`Message "${trimmedInput}" already exists`)
        return
      }

      setDuplicateError(false)

      const newMessage: MessageData = {
        text: trimmedInput,
        direction: "forward",
      }
      const newMessages = [...messages, newMessage]
      handleMessagesChange(newMessages)
      setNewLabelInput("")
    }
  }

  const handleInputChange = (value: string) => {
    setNewLabelInput(value)
    if (duplicateError) {
      const trimmedValue = value.trim()
      const wouldBeDuplicate =
        trimmedValue &&
        messages.some(
          (msg) => msg.text.toLowerCase() === trimmedValue.toLowerCase()
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
    const newMessages = [...messages]
    newMessages[index] = { ...newMessages[index], text: value }
    handleMessagesChange(newMessages)
  }

  const handleMessageDirectionToggle = (index: number) => {
    const newMessages = [...messages]
    newMessages[index] = {
      ...newMessages[index],
      direction:
        newMessages[index].direction === "forward" ? "backward" : "forward",
    }
    handleMessagesChange(newMessages)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
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

      {messages.map((message, index) => {
        const isDuplicateText = messages.some(
          (msg, i) =>
            i !== index &&
            msg.text.toLowerCase() === message.text.toLowerCase() &&
            message.text.trim() !== ""
        )

        return (
          <Box
            key={index}
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
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
            <DeleteOutlineOutlinedIcon
              sx={{ cursor: "pointer", width: 16, height: 16 }}
              onClick={() => handleDeleteMessage(index)}
            />
          </Box>
        )
      })}

      {/* Add new message input */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <TextField
          value={newLabelInput}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          size="small"
          fullWidth
          placeholder="+ Add Message"
          error={duplicateError}
          helperText={duplicateError ? "This message already exists" : ""}
        />
      </Box>
    </Box>
  )
}
