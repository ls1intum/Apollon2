import { useViewportCenter } from "@/hooks"
import { useDiagramStore } from "@/store"
import { getPositionOnCanvas, getQuadrant, getPopoverOrigin } from "@/utils"
import { TextField, Button } from "@mui/material"
import { useState } from "react"
import { useShallow } from "zustand/shallow"
import { GenericPopover } from "../GenericPopover"

interface PopoverComponentProps {
  nodeId: string
  anchorEl: HTMLElement | null
  open: boolean
  onClose: () => void
}

export const ClassGiveFeedbackPopover = ({
  nodeId,
  anchorEl,
  open,
  onClose,
}: PopoverComponentProps) => {
  const { nodes } = useDiagramStore(
    useShallow((state) => ({
      nodes: state.nodes,
    }))
  )
  const viewportCenter = useViewportCenter()
  const [feedback, setFeedback] = useState("")

  if (!anchorEl || !open) {
    return null
  }

  const node = nodes.find((node) => node.id === nodeId)
  if (!node) {
    return null
  }
  const nodePositionOnCanvas = getPositionOnCanvas(node, nodes)
  const quadrant = getQuadrant(nodePositionOnCanvas, viewportCenter)
  const popoverOrigin = getPopoverOrigin(quadrant)

  const handleSubmitFeedback = () => {
    console.log(`Feedback for node ${nodeId}: ${feedback}`)
    setFeedback("")
    onClose()
  }

  return (
    <GenericPopover
      id={`give-feedback-popover-${nodeId}`}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={popoverOrigin.anchorOrigin}
      transformOrigin={popoverOrigin.transformOrigin}
      maxHeight={400}
    >
      <TextField
        id="feedback-input"
        variant="outlined"
        multiline
        rows={4}
        value={feedback}
        onChange={(event) => setFeedback(event.target.value)}
        size="small"
        placeholder="Enter your feedback"
        sx={{ backgroundColor: "#fff", width: "100%", mb: 1 }}
      />
      <Button
        variant="contained"
        onClick={handleSubmitFeedback}
        disabled={!feedback.trim()}
      >
        Submit Feedback
      </Button>
    </GenericPopover>
  )
}
