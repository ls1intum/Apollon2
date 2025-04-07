export type ModalName = "NEW_DIAGRAM" | "NEW_DIAGRAM_FROM_TEMPLATE" | "SHARE" // Extend as needed

export interface ModalProps {
  [key: string]: unknown
}

export enum DiagramView {
  EDIT = "EDIT",
  COLLABORATE = "COLLABORATE",
  GIVE_FEEDBACK = "GIVE_FEEDBACK",
  SEE_FEEDBACK = "SEE_FEEDBACK",
}
