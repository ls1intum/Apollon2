import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { useState } from "react"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import { useModalContext } from "@/contexts/ModalContext"
import { UMLDiagramType } from "@apollon2/library"
import { useNavigate } from "react-router"

const diagramTypes = {
  structural: [UMLDiagramType.ClassDiagram, UMLDiagramType.ObjectDiagram],
  behavioral: [],
}

const diagramTypeToTitle: Record<UMLDiagramType, string> = {
  ClassDiagram: "Class Diagram",
  ObjectDiagram: "Object Diagram",
  ActivityDiagram: "",
  UseCaseDiagram: "",
  CommunicationDiagram: "",
  ComponentDiagram: "",
  DeploymentDiagram: "",
  PetriNet: "",
  ReachabilityGraph: "",
  SyntaxTree: "",
  Flowchart: "",
  BPMN: "",
}

export const NewDiagramModal = () => {
  const { closeModal } = useModalContext()
  const [isDiagramNameDefault, setIsDiagramNameDefault] =
    useState<boolean>(true)
  const [newDiagramTitle, setNewDiagramTitle] =
    useState<string>("Class Diagram")
  const [selectedDiagramType, setSelectedDiagramType] =
    useState<UMLDiagramType>(UMLDiagramType.ClassDiagram)
  const navigate = useNavigate()

  const handleCreateDiagram = () => {
    navigate("/", {
      state: { createdAt: Date.now(), newDiagramTitle, selectedDiagramType },
    })
    closeModal()
  }

  const handleSelectDiagramType = (type: UMLDiagramType) => {
    setSelectedDiagramType(type)
  }

  const handleDiagramNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewDiagramTitle(event.target.value)
    setIsDiagramNameDefault(false)
  }

  const handleDiagramTypeChange = (type: UMLDiagramType) => {
    setSelectedDiagramType(type)
    if (isDiagramNameDefault) {
      setNewDiagramTitle(diagramTypeToTitle[type])
    }
  }

  return (
    <Box
      sx={{
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
          value={newDiagramTitle}
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
  )
}
