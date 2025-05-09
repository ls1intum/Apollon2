import { useDiagramStore } from "@/store"
import { Box } from "@mui/material"
import { useShallow } from "zustand/shallow"
import { GenericPopover } from "../GenericPopover"
import { ClassNodeProps } from "@/types"
import { PopoverProps } from "../types"
import { GiveFeedbackAssessmentBox } from "../GiveFeedbackAssessmentBox"

export const ClassGiveFeedbackPopover = ({
  nodeId,
  anchorEl,
  open,
  onClose,
  popoverOrigin,
}: PopoverProps) => {
  const { nodes } = useDiagramStore(
    useShallow((state) => ({ nodes: state.nodes }))
  )

  if (!anchorEl || !open) return null

  const node = nodes.find((node) => node.id === nodeId)
  if (!node) return null

  const nodeData = node.data as ClassNodeProps

  return (
    <GenericPopover
      id={`give-feedback-popover-${nodeId}`}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={popoverOrigin.anchorOrigin}
      transformOrigin={popoverOrigin.transformOrigin}
      maxHeight={700}
    >
      <Box sx={{ p: 2, maxWidth: 400 }}>
        <GiveFeedbackAssessmentBox
          elementId={nodeId}
          name={nodeData.name}
          type="Node"
        />
        {nodeData.attributes.map((attr) => (
          <GiveFeedbackAssessmentBox
            key={attr.id}
            elementId={attr.id}
            name={attr.name}
            type="Attribute"
          />
        ))}
        {nodeData.methods.map((method) => (
          <GiveFeedbackAssessmentBox
            key={method.id}
            elementId={method.id}
            name={method.name}
            type="Method"
          />
        ))}
      </Box>
    </GenericPopover>
  )
}
