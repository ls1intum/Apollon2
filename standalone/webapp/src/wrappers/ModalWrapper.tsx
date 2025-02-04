import {
  NewDiagramModal,
  NewDiagramFromTemplateModal,
} from "@/components/modals"
import { ModalName, ModalProps } from "@/types"
import React from "react"

interface ModalWrapperProps {
  name: ModalName
  props?: ModalProps
  closeModal: () => void
}

// Define a mapping from modal names to modal components
const MODAL_COMPONENTS: Record<ModalName, React.ComponentType<unknown>> = {
  NEW_DIAGRAM: NewDiagramModal,
  NEW_DIAGRAM_FROM_TEMPLATE: NewDiagramFromTemplateModal,
  // Add other modals here
}
 
export const ModalWrapper: React.FC<ModalWrapperProps> = ({ name }) => {
  const SpecificModal = MODAL_COMPONENTS[name]

  if (!SpecificModal) {
    console.error(`No modal found for name: ${name}`)
    return null
  }

  return (
    <>
      <SpecificModal />
    </>
  )
}
