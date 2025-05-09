import { TextField, Box, Typography } from "@mui/material"
import { useState } from "react"
import { useDiagramStore } from "@/store"
import { Assessment } from "@/types"
import { useShallow } from "zustand/shallow"

interface Props {
  elementId: string
  name: string
  type: string
}

export const GiveFeedbackAssessmentBox = ({ elementId, name, type }: Props) => {
  const { assessments, setAssessments } = useDiagramStore(
    useShallow((state) => ({
      assessments: state.assessments,
      setAssessments: state.setAssessments,
    }))
  )

  const existing = assessments[elementId]

  const [score, setScore] = useState(existing?.score?.toString() ?? "")
  const [feedback, setFeedback] = useState(existing?.feedback ?? "")

  const updateAssessment = (newScore: string, newFeedback: string) => {
    const parsedScore = parseFloat(newScore)
    const validScore = isNaN(parsedScore) ? 0 : parsedScore

    const updated: Assessment = {
      modelElementId: elementId,
      elementType: type.toLowerCase() as "node" | "attribute" | "method",
      score: newScore === "" ? 0 : validScore,
      feedback: newFeedback || undefined,
    }

    setAssessments((prev) => ({
      ...prev,
      [elementId]: updated,
    }))
  }

  return (
    <Box sx={{ p: 2, mb: 2, bgcolor: "grey.200", borderRadius: 1 }}>
      <Typography variant="subtitle1">{`${type}: ${name}`}</Typography>
      <TextField
        label="Score"
        type="number"
        value={score}
        onChange={(e) => {
          const value = e.target.value
          setScore(value)
          updateAssessment(value, feedback)
        }}
        fullWidth
        margin="normal"
        inputProps={{ step: "any" }}
      />
      <TextField
        label="Feedback"
        multiline
        rows={3}
        value={feedback}
        onChange={(e) => {
          const value = e.target.value
          setFeedback(value)
          updateAssessment(score, value)
        }}
        fullWidth
        margin="normal"
      />
    </Box>
  )
}
