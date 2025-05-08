import { useDiagramStore } from "@/store"
import { Box, Typography } from "@mui/material"
import { useShallow } from "zustand/shallow"
import { GenericPopover } from "../GenericPopover"
import { Assessment, ClassNodeProps } from "@/types"
import { PopoverProps } from "../types"

export const ClassSeeFeedbackPopover = ({
  nodeId,
  anchorEl,
  open,
  onClose,
  popoverOrigin,
}: PopoverProps) => {
  const { nodes, assessments } = useDiagramStore(
    useShallow((state) => ({
      nodes: state.nodes,
      assessments: state.assessments,
    }))
  )

  if (!anchorEl || !open) {
    return null
  }

  const node = nodes.find((node) => node.id === nodeId)
  if (!node) {
    return null
  }

  const nodeData = node.data as ClassNodeProps

  // Collect assessments for node, attributes, and methods
  const nodeAssessment = assessments.find(
    (ass) => ass.modelElementId === nodeId
  )
  const attributeAssessments = assessments.filter((ass) =>
    nodeData.attributes.some((attr) => attr.id === ass.modelElementId)
  )
  const methodAssessments = assessments.filter((ass) =>
    nodeData.methods.some((method) => method.id === ass.modelElementId)
  )

  // Check if there are any assessments to display
  const hasAssessments =
    nodeAssessment ||
    attributeAssessments.length > 0 ||
    methodAssessments.length > 0

  return (
    <GenericPopover
      id={`see-feedback-popover-${nodeId}`}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={popoverOrigin.anchorOrigin}
      transformOrigin={popoverOrigin.transformOrigin}
      maxHeight={700}
    >
      <Box sx={{ p: 2, maxWidth: 400 }}>
        {!hasAssessments ? (
          <Typography variant="body1" sx={{ p: 2 }}>
            No feedback available
          </Typography>
        ) : (
          <>
            {nodeAssessment &&
              renderAssessmentBox(nodeAssessment, nodeData.name, "Node")}

            {attributeAssessments.map((ass) => {
              const attr = nodeData.attributes.find(
                (a) => a.id === ass.modelElementId
              )
              return attr
                ? renderAssessmentBox(ass, attr.name, "Attribute")
                : null
            })}

            {methodAssessments.map((ass) => {
              const method = nodeData.methods.find(
                (m) => m.id === ass.modelElementId
              )
              return method
                ? renderAssessmentBox(ass, method.name, "Method")
                : null
            })}
          </>
        )}
      </Box>
    </GenericPopover>
  )
}

const renderAssessmentBox = (
  assessment: Assessment,
  name: string,
  type: string
) => (
  <Box
    key={assessment.modelElementId}
    sx={{ p: 2, mb: 2, bgcolor: "grey.100", borderRadius: 1 }}
  >
    <Typography variant="subtitle1">{`${type}: ${name}`}</Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
      <strong>Score:</strong> {assessment.score}
    </Typography>
    {assessment.feedback && (
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        <strong>Feedback:</strong> {assessment.feedback}
      </Typography>
    )}
  </Box>
)
