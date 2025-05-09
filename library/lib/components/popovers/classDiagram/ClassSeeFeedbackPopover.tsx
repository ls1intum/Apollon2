import { useDiagramStore } from "@/store"
import { Box, Typography } from "@mui/material"
import { useShallow } from "zustand/shallow"
import { ClassNodeProps } from "@/types"
import { PopoverProps } from "../types"
import { SeeFeedbackAssessmentBox } from "../SeeFeedbackAssessmentBox"

export const ClassSeeFeedbackPopover = ({ elementId }: PopoverProps) => {
  const { nodes, assessments } = useDiagramStore(
    useShallow((state) => ({
      nodes: state.nodes,
      assessments: state.assessments,
    }))
  )

  const node = nodes.find((node) => node.id === elementId)
  if (!node) return null

  const nodeData = node.data as ClassNodeProps

  const nodeAssessment = assessments[elementId]
  const attributeAssessments = nodeData.attributes
    .map((attr) => ({
      assessment: assessments[attr.id],
      name: attr.name,
      id: attr.id,
    }))
    .filter((a) => a.assessment)

  const methodAssessments = nodeData.methods
    .map((method) => ({
      assessment: assessments[method.id],
      name: method.name,
      id: method.id,
    }))
    .filter((m) => m.assessment)

  const hasAssessments =
    nodeAssessment || attributeAssessments.length || methodAssessments.length

  return (
    <Box sx={{ p: 2, maxWidth: 400 }}>
      {!hasAssessments ? (
        <Typography variant="body1" sx={{ p: 2 }}>
          No feedback available
        </Typography>
      ) : (
        <>
          {nodeAssessment && (
            <SeeFeedbackAssessmentBox
              assessment={nodeAssessment}
              name={nodeData.name}
              type="Node"
            />
          )}

          {attributeAssessments.map(({ assessment, name, id }) => (
            <SeeFeedbackAssessmentBox
              key={id}
              assessment={assessment!}
              name={name}
              type="Attribute"
            />
          ))}

          {methodAssessments.map(({ assessment, name, id }) => (
            <SeeFeedbackAssessmentBox
              key={id}
              assessment={assessment!}
              name={name}
              type="Method"
            />
          ))}
        </>
      )}
    </Box>
  )
}
