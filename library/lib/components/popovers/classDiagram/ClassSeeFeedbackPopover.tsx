// Popover for viewing feedback

import { useViewportCenter } from "@/hooks"
import { useDiagramStore } from "@/store"
import { getPositionOnCanvas, getQuadrant, getPopoverOrigin } from "@/utils"
import { List, ListItem, ListItemText } from "@mui/material"
import { useShallow } from "zustand/shallow"
import { GenericPopover } from "../GenericPopover"

interface PopoverComponentProps {
  nodeId: string
  anchorEl: HTMLElement | null
  open: boolean
  onClose: () => void
}

export const ClassSeeFeedbackPopover = ({
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

  // Placeholder: Replace with actual feedback data
  const feedbackList = [
    { id: 1, text: "Great class design!", timestamp: "2025-05-03 10:00" },
    {
      id: 2,
      text: "Consider adding more methods.",
      timestamp: "2025-05-03 11:00",
    },
  ]

  return (
    <GenericPopover
      id={`see-feedback-popover-${nodeId}`}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={popoverOrigin.anchorOrigin}
      transformOrigin={popoverOrigin.transformOrigin}
      maxHeight={400}
    >
      <List sx={{ width: "100%", maxWidth: 360 }}>
        {feedbackList.length === 0 ? (
          <ListItem>
            <ListItemText primary="No feedback available" />
          </ListItem>
        ) : (
          feedbackList.map((feedback) => (
            <ListItem key={feedback.id}>
              <ListItemText
                primary={feedback.text}
                secondary={feedback.timestamp}
              />
            </ListItem>
          ))
        )}
      </List>
    </GenericPopover>
  )
}
