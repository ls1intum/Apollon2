export type FeedbackCorrectionStatus = {
  description?: string
  status: "CORRECT" | "INCORRECT" | "NOT_VALIDATED"
}

export type Assessment = {
  modelElementId: string
  elementType: string
  score: number
  feedback?: string
  // dropInfo?: any;
  label?: string
  labelColor?: string
  correctionStatus?: FeedbackCorrectionStatus
}
