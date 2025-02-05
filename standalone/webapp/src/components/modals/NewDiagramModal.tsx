import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Modal from "@mui/material/Modal"
import { useApollon2Context } from "@/contexts"
import { useState } from "react"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import { useModalContext } from "@/contexts/ModalContext"
import { DiagramType } from "@apollon2/library"
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined"
import Paper from "@mui/material/Paper"
import Divider from "@mui/material/Divider"

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  display: "flex",
  flex: 1,
  flexDirection: "column",
  minWidth: 350,
  gap: 1,
}

const diagramTypes = {
  structural: [DiagramType.ClassDiagram, DiagramType.ObjectDiagram],
  behavioral: [],
}

const diagramTypeToTitle = {
  [DiagramType.ClassDiagram]: "Class Diagram",
  [DiagramType.ObjectDiagram]: "Object Diagram",
}

export const NewDiagramModal = () => {
  const { apollon2, setDiagramName } = useApollon2Context()
  const { closeModal } = useModalContext()
  const [isDiagramNameDefault, setIsDiagramNameDefault] =
    useState<boolean>(true)
  const [newDiagramName, setNewDiagramName] = useState<string>("Class Diagram")
  const [selectedDiagramType, setSelectedDiagramType] = useState<DiagramType>(
    DiagramType.ClassDiagram
  )

  const handleCreateDiagram = () => {
    setDiagramName(newDiagramName)
    apollon2?.createNewDiagram(selectedDiagramType)
    closeModal()
  }

  const handleSelectDiagramType = (type: DiagramType) => {
    setSelectedDiagramType(type)
  }

  const handleDiagramNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewDiagramName(event.target.value)
    setIsDiagramNameDefault(false)
  }

  const handleDiagramTypeChange = (type: DiagramType) => {
    setSelectedDiagramType(type)
    if (isDiagramNameDefault) {
      setNewDiagramName(diagramTypeToTitle[type])
    }
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
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
          }}
        >
          <Typography variant="h5" id="modal-modal-title">
            Create new Diagram
          </Typography>
          <Button variant="text" onClick={closeModal} size="small">
            <CloseOutlinedIcon style={{ color: "gray" }} />
          </Button>
        </Box>
        <Divider />

        <Box
          sx={{
            px: 2,
            pb: 2,
            gap: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Diagram Title */}
          <Box>
            <Typography
              variant="body2"
              component="label"
              htmlFor="diagram-title"
              className="form-label"
            >
              Diagram Title
            </Typography>
            <TextField
              fullWidth
              id="diagram-title"
              value={newDiagramName}
              onChange={handleDiagramNameChange}
              placeholder="Enter diagram title"
              variant="outlined"
            />
          </Box>

          {/* Diagram Type Selection */}
          <Box>
            <Box className="card">
              <Typography variant="h6" className="card-header">
                Structural Diagrams
              </Typography>
              <Box
                className="list-group list-group-flush"
                sx={{ gap: 1, flexDirection: "column", display: "flex" }}
              >
                {diagramTypes.structural.map((type) => (
                  <Button
                    key={type}
                    onClick={() => handleDiagramTypeChange(type)}
                    onDoubleClick={handleCreateDiagram}
                    variant={
                      selectedDiagramType === type ? "contained" : "outlined"
                    }
                    style={{ justifyContent: "flex-start" }}
                    className={`list-group-item list-group-item-action `}
                  >
                    {diagramTypeToTitle[type]}
                  </Button>
                ))}
              </Box>
            </Box>
            {/* Behavioral Diagrams */}
            {diagramTypes.behavioral.length > 0 && (
              <Box className="card mt-2">
                <Typography variant="h6" className="card-header">
                  Behavioral Diagrams
                </Typography>
                <Box className="list-group list-group-flush">
                  {diagramTypes.behavioral.map((type) => (
                    <Button
                      key={type}
                      onClick={() => handleSelectDiagramType(type)}
                      className={`list-group-item list-group-item-action ${
                        selectedDiagramType === type ? "active" : ""
                      }`}
                    >
                      {diagramTypeToTitle[type]}
                    </Button>
                  ))}
                </Box>
              </Box>
            )}
          </Box>

          {/* Footer with buttons */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button
              variant="contained"
              onClick={closeModal}
              sx={{ bgcolor: "gray", textTransform: "none" }}
            >
              Close
            </Button>
            <Button
              variant="contained"
              onClick={handleCreateDiagram}
              sx={{ textTransform: "none" }}
            >
              Create Diagram
            </Button>
          </Box>
        </Box>
      </Paper>
    </Modal>
  )
}
