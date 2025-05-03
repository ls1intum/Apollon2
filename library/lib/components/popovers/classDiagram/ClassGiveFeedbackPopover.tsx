import { useViewportCenter } from "@/hooks"
import { useDiagramStore } from "@/store"
import { getPositionOnCanvas, getQuadrant, getPopoverOrigin } from "@/utils"
import { Button, TextField, Box, Typography } from "@mui/material"
import { useState } from "react"
import { useShallow } from "zustand/shallow"
import { GenericPopover } from "../GenericPopover"
import { Assessment, ClassNodeProps } from "@/types"

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
  const { nodes, assessments, setAssessments } = useDiagramStore(
    useShallow((state) => ({
      nodes: state.nodes,
      assessments: state.assessments,
      setAssessments: state.setAssessments,
    }))
  )

  const viewportCenter = useViewportCenter()
  const [localAssessments, setLocalAssessments] = useState<
    Record<string, { score: string; feedback: string }>
  >({})

  if (!anchorEl || !open) {
    return null
  }

  const node = nodes.find((node) => node.id === nodeId)
  if (!node) {
    return null
  }

  const nodeData = node.data as ClassNodeProps
  const nodePositionOnCanvas = getPositionOnCanvas(node, nodes)
  const quadrant = getQuadrant(nodePositionOnCanvas, viewportCenter)
  const popoverOrigin = getPopoverOrigin(quadrant)

  const handleAssessmentChange = (
    elementId: string,
    field: "score" | "feedback",
    value: string
  ) => {
    setLocalAssessments((prev) => ({
      ...prev,
      [elementId]: {
        ...(prev[elementId] ?? { score: "", feedback: "" }),
        [field]: value,
      },
    }))
  }

  const handleSubmitFeedback = () => {
    const updatedAssessments: Assessment[] = []

    // Handle node assessment
    if (localAssessments[nodeId]) {
      const score = parseFloat(localAssessments[nodeId].score)
      if (!isNaN(score)) {
        updatedAssessments.push({
          modelElementId: nodeId,
          elementType: "node",
          score,
          feedback: localAssessments[nodeId].feedback || undefined,
        })
      }
    }

    // Handle attributes assessments
    nodeData.attributes.forEach((attr) => {
      if (localAssessments[attr.id]) {
        const score = parseFloat(localAssessments[attr.id].score)
        if (!isNaN(score)) {
          updatedAssessments.push({
            modelElementId: attr.id,
            elementType: "attribute",
            score,
            feedback: localAssessments[attr.id].feedback || undefined,
          })
        }
      }
    })

    // Handle methods assessments
    nodeData.methods.forEach((method) => {
      if (localAssessments[method.id]) {
        const score = parseFloat(localAssessments[method.id].score)
        if (!isNaN(score)) {
          updatedAssessments.push({
            modelElementId: method.id,
            elementType: "method",
            score,
            feedback: localAssessments[method.id].feedback || undefined,
          })
        }
      }
    })

    // Update store with new or updated assessments
    setAssessments((prevAssessments) => {
      const newAssessments = [...prevAssessments]
      updatedAssessments.forEach((newAssessment) => {
        const index = newAssessments.findIndex(
          (ass) => ass.modelElementId === newAssessment.modelElementId
        )
        if (index >= 0) {
          newAssessments[index] = newAssessment
        } else {
          newAssessments.push(newAssessment)
        }
      })
      return newAssessments
    })

    setLocalAssessments({})
    onClose()
  }

  const renderAssessmentBox = (
    elementId: string,
    name: string,
    type: string
  ) => {
    const existingAssessment = assessments.find(
      (ass) => ass.modelElementId === elementId
    )
    const localAssessment = localAssessments[elementId] ?? {
      score: existingAssessment?.score?.toString() ?? "",
      feedback: existingAssessment?.feedback ?? "",
    }

    return (
      <Box
        key={elementId}
        sx={{ p: 2, mb: 2, bgcolor: "grey.200", borderRadius: 1 }}
      >
        <Typography variant="subtitle1">{`${type}: ${name}`}</Typography>
        <TextField
          label="Score"
          type="number"
          value={localAssessment.score}
          onChange={(e) =>
            handleAssessmentChange(elementId, "score", e.target.value)
          }
          fullWidth
          margin="normal"
          inputProps={{ step: "any" }} // Allows decimal and negative numbers
        />
        <TextField
          label="Feedback"
          multiline
          rows={3}
          value={localAssessment.feedback}
          onChange={(e) =>
            handleAssessmentChange(elementId, "feedback", e.target.value)
          }
          fullWidth
          margin="normal"
        />
      </Box>
    )
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
      <Box sx={{ p: 2, maxWidth: 400 }}>
        {/* Node assessment */}
        {renderAssessmentBox(nodeId, nodeData.name, "Node")}

        {/* Attributes assessments */}
        {nodeData.attributes.map((attr) =>
          renderAssessmentBox(attr.id, attr.name, "Attribute")
        )}

        {/* Methods assessments */}
        {nodeData.methods.map((method) =>
          renderAssessmentBox(method.id, method.name, "Method")
        )}

        <Button
          variant="contained"
          onClick={handleSubmitFeedback}
          disabled={Object.values(localAssessments).every(
            (ass) => !ass.score && !ass.feedback
          )}
          sx={{ mt: 2 }}
        >
          Submit Feedback
        </Button>
      </Box>
    </GenericPopover>
  )
}
