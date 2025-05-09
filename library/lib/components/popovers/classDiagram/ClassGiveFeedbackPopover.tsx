import { useDiagramStore } from "@/store"
import { Box } from "@mui/material"
import { useShallow } from "zustand/shallow"
import { ClassNodeProps } from "@/types"
import { PopoverProps } from "../types"
import { GiveFeedbackAssessmentBox } from "../GiveFeedbackAssessmentBox"

export const ClassGiveFeedbackPopover = ({ elementId }: PopoverProps) => {
  const { nodes } = useDiagramStore(
    useShallow((state) => ({ nodes: state.nodes }))
  )

  const node = nodes.find((node) => node.id === elementId)
  if (!node) return null

  const nodeData = node.data as ClassNodeProps

  return (
    <Box sx={{ p: 2, maxWidth: 400 }}>
      <GiveFeedbackAssessmentBox
        elementId={elementId}
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
  )
}
