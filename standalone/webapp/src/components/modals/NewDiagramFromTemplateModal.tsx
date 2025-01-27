import Box from "@mui/material/Box"
import Modal from "@mui/material/Modal"
import { useApollon2Context } from "@/contexts"
import Button from "@mui/material/Button/Button"
import { useModalContext } from "@/contexts/ModalContext"
import ListItemText from "@mui/material/ListItemText"
import MenuItem from "@mui/material/MenuItem"
import MenuList from "@mui/material/MenuList"
import Divider from "@mui/material/Divider"
import { Paper, Typography } from "@mui/material"
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined"
import { useState } from "react"

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  display: "flex",
  flex: 1,
  flexDirection: "column",
  minWidth: 350,
  gap: 1,
}

enum TemplateType {
  Adapter = "Adapter",
  Bridge = "Bridge",
  Command = "Command",
  Observer = "Observer",
  Factory = "Factory",
}

export const NewDiagramFromTemplateModal = () => {
  const { apollon2, setDiagramName } = useApollon2Context()
  const { closeModal } = useModalContext()
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>(
    TemplateType.Adapter
  )
  const [error, setError] = useState<string | null>(null)

  const handleCreate = async () => {
    console.log("Create diagram from template")
    setError(null)

    try {
      const jsonModule = await import(
        `assets/diagramTemplates/${selectedTemplate}.json`
      )
      const jsonData = jsonModule.default

      if (!jsonData) {
        throw new Error("Selected template data not found")
      }

      const JsonDataINStringFormat = JSON.stringify(jsonData)
      const diagramName = jsonData.title as string

      setDiagramName(diagramName)
      apollon2?.importJson(JsonDataINStringFormat)
      closeModal()
    } catch (err: unknown) {
      console.error("Error creating diagram from template:", err)

      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("An unexpected error occurred")
      }
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
            Start Diagram from template
          </Typography>
          <Button variant="text" onClick={closeModal} size="small">
            <CloseOutlinedIcon style={{ color: "gray" }} />
          </Button>
        </Box>
        <Divider />

        <Box sx={{ pt: 2, px: 2 }}>
          {error && (
            <Box sx={{ px: 1, color: "red", mb: 1 }}>
              <Typography variant="body2">{error}</Typography>
            </Box>
          )}

          {/* Selected Template */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
            <Typography variant="body1">Selected Template</Typography>
            <Box
              sx={{
                p: 1,
                mt: 0.5,
                mb: 1,
                bgcolor: "lightgray",
                borderRadius: 1,
              }}
            >
              <Typography color="textPrimary">{selectedTemplate}</Typography>
            </Box>
          </Box>

          <MenuList dense>
            <Typography variant="h6">Structural</Typography>
            <MenuItem
              selected={selectedTemplate === TemplateType.Adapter}
              onClick={() => setSelectedTemplate(TemplateType.Adapter)}
              onDoubleClick={handleCreate}
            >
              <ListItemText inset>Adapter</ListItemText>
            </MenuItem>
            <MenuItem
              selected={selectedTemplate === TemplateType.Bridge}
              onClick={() => setSelectedTemplate(TemplateType.Bridge)}
              onDoubleClick={handleCreate}
            >
              <ListItemText inset>Bridge</ListItemText>
            </MenuItem>

            <Divider />
            <Typography variant="h6">Behavioral</Typography>
            <MenuItem
              selected={selectedTemplate === TemplateType.Command}
              onClick={() => setSelectedTemplate(TemplateType.Command)}
              onDoubleClick={handleCreate}
            >
              <ListItemText inset>Command</ListItemText>
            </MenuItem>
            <MenuItem
              selected={selectedTemplate === TemplateType.Observer}
              onClick={() => setSelectedTemplate(TemplateType.Observer)}
              onDoubleClick={handleCreate}
            >
              <ListItemText inset>Obersver</ListItemText>
            </MenuItem>

            <Divider />
            <Typography variant="h6">Creational</Typography>
            <MenuItem
              selected={selectedTemplate === TemplateType.Factory}
              onClick={() => setSelectedTemplate(TemplateType.Factory)}
              onDoubleClick={handleCreate}
            >
              <ListItemText inset>Factory</ListItemText>
            </MenuItem>
          </MenuList>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            flex: 1,
            pb: 2,
            px: 2,
            gap: 1,
          }}
        >
          <Button
            variant="contained"
            onClick={closeModal}
            sx={{ bgcolor: "gray", textTransform: "none" }}
          >
            Close
          </Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            sx={{
              textTransform: "none",
            }}
          >
            Create Diagram
          </Button>
        </Box>
      </Paper>
    </Modal>
  )
}
