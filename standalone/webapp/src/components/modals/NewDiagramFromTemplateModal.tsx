import { Box } from "../ui"
import { Button } from "../ui"
import { useModalContext } from "@/contexts/ModalContext"
import { ListItemText } from "../ui"
import { MenuItem } from "../ui"
import { MenuList } from "../ui"
import { Divider } from "../ui"
import { Typography } from "../ui"
import { useState } from "react"
import { usePersistenceModelStore } from "@/stores/usePersistenceModelStore"
import { useNavigate } from "react-router"

enum TemplateType {
  Adapter = "Adapter",
  Bridge = "Bridge",
  Command = "Command",
  Observer = "Observer",
  Factory = "Factory",
}

export const NewDiagramFromTemplateModal = () => {
  const { closeModal } = useModalContext()
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>(
    TemplateType.Adapter
  )
  const createModel = usePersistenceModelStore((store) => store.createModel)
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  const handleCreate = async () => {
    setError(null)

    try {
      const jsonModule = await import(
        `assets/diagramTemplates/${selectedTemplate}.json`
      )
      const jsonData = jsonModule.default

      if (!jsonData) {
        throw new Error("Selected template data not found")
      }
      const timeStapToCreate = new Date().getTime()

      createModel(jsonData)
      navigate("..", {
        relative: "route",
        state: { timeStapToCreate },
      })

      // Handle passed diagram model from new page location data
      // const JsonDataINStringFormat = JSON.stringify(jsonData)
      // const diagramName = jsonData.title as string

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
    <Box>
      <Box style={{ paddingTop: 86, paddingLeft: 16, paddingRight: 16 }}>
        {error && (
          <Box
            style={{
              paddingLeft: 8,
              paddingRight: 8,
              color: "red",
              marginBottom: 8,
            }}
          >
            <Typography variant="body2">{error}</Typography>
          </Box>
        )}

        {/* Selected Template */}
        <Box style={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
          <Typography variant="body1">Selected Template</Typography>
          <Box
            style={{
              padding: 8,
              marginTop: 4,
              marginBottom: 8,
              backgroundColor: "lightgray",
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
            <ListItemText inset>Observer</ListItemText>
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
        style={{
          display: "flex",
          justifyContent: "flex-end",
          flex: 1,
          paddingBottom: 16,
          paddingLeft: 16,
          paddingRight: 16,
          gap: 8,
        }}
      >
        <Button
          variant="contained"
          onClick={closeModal}
          style={{ backgroundColor: "gray", textTransform: "none" }}
        >
          Close
        </Button>
        <Button
          variant="contained"
          onClick={handleCreate}
          style={{
            textTransform: "none",
          }}
        >
          Create Diagram
        </Button>
      </Box>
    </Box>
  )
}
