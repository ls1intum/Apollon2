import React from "react"
import {
  NewDiagramModal,
  NewDiagramFromTemplateModal,
} from "@/components/modals"
import { ShareModal } from "@/components/modals/ShareModal"
import { useModalContext } from "@/contexts"
import { ModalName, ModalProps } from "@/types"
import { Modal, Paper, Box, Typography, Button, Divider } from "@mui/material"
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined"

interface ModalWrapperProps {
  name: ModalName
  props?: ModalProps
  closeModal: () => void
}

// Define a mapping from modal names to modal components
const MODAL_COMPONENTS: Record<ModalName, React.ComponentType<unknown>> = {
  NEW_DIAGRAM: NewDiagramModal,
  NEW_DIAGRAM_FROM_TEMPLATE: NewDiagramFromTemplateModal,
  SHARE: ShareModal,
  // Add other modals here
}

const MODAL_TITLES: Record<ModalName, string> = {
  NEW_DIAGRAM: "Create new Diagram",
  NEW_DIAGRAM_FROM_TEMPLATE: "Create new Diagram from Template",
  SHARE: "Share",
  // Add other modals here
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  display: "flex",
  flex: 1,
  flexDirection: "column",
  minWidth: 350,
  maxWidth: window.innerWidth * 0.6,
  gap: 1,
}

export const ModalWrapper: React.FC<ModalWrapperProps> = ({ name, props }) => {
  const SpecificModal = MODAL_COMPONENTS[name]
  const { closeModal } = useModalContext()

  if (!SpecificModal) {
    console.error(`No modal found for name: ${name}`)
    return null
  }

  return (
    <Modal
      open
      onClose={closeModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Paper sx={style}>
        {/* Header */}
        <Box
          sx={{
            position: "relative",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
          }}
        >
          <Typography variant="h5" id="modal-modal-title">
            {MODAL_TITLES[name]}
          </Typography>

          <Button
            sx={{ position: "absolute", top: 16, right: 8 }}
            onClick={closeModal}
          >
            <CloseOutlinedIcon sx={{ color: "grey" }} />
          </Button>
        </Box>
        <Divider />

        {/* Content */}
        <Box sx={{ p: 2 }}>{SpecificModal && <SpecificModal {...props} />}</Box>
      </Paper>
    </Modal>
  )
}
