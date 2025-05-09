import { Box, Typography } from "@mui/material"
import { Assessment } from "@/types"

export const SeeFeedbackAssessmentBox = ({
  assessment,
  name,
  type,
}: {
  assessment: Assessment
  name: string
  type: string
}) => (
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
