import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Modal from "@mui/material/Modal"
import { useApollon2Context } from "@/contexts"
import { useState } from "react"
import TextField from "@mui/material/TextField/TextField"
import Button from "@mui/material/Button/Button"
import { useModalContext } from "@/contexts/ModalContext"

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 2,
  display: "flex",
  flex: 1,
  flexDirection: "column",
  minWidth: 300,
  gap: 1,
}

export const NewDiagramModal = () => {
  const { apollon2, setDiagramName } = useApollon2Context()
  const { closeModal } = useModalContext()
  const [newDiagramName, setNewDiagramName] = useState("")

  return (
    <Modal
      open
      onClose={closeModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Box>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Create new diagram
          </Typography>
          <TextField
            fullWidth
            value={newDiagramName}
            onChange={(event) => setNewDiagramName(event.target.value)}
          />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end", flex: 1 }}>
          <Button
            variant="contained"
            onClick={() => {
              setDiagramName(newDiagramName)
              closeModal()
              apollon2?.resetDiagram()
            }}
          >
            Create
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}
