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
  minWidth: 700,
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
  const { apollon2 } = useApollon2Context()
  const { closeModal } = useModalContext()
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>(
    TemplateType.Adapter
  )

  return (
    <Modal
      open
      onClose={closeModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Paper sx={style}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", p: 2 }}>
          <Typography variant="h5" id="modal-modal-title">
            Start Diagram from template
          </Typography>
          <CloseOutlinedIcon onClick={closeModal} />
        </Box>
        <Divider />

        <MenuList dense sx={{ pt: 2, px: 2 }}>
          <Typography variant="h6">Structural</Typography>
          <MenuItem
            selected={selectedTemplate === TemplateType.Adapter}
            onClick={() => setSelectedTemplate(TemplateType.Adapter)}
          >
            <ListItemText inset>Adapter</ListItemText>
          </MenuItem>
          <MenuItem
            selected={selectedTemplate === TemplateType.Bridge}
            onClick={() => setSelectedTemplate(TemplateType.Bridge)}
          >
            <ListItemText inset>Bridge</ListItemText>
          </MenuItem>

          <Divider />
          <Typography variant="h6">Behavioral</Typography>
          <MenuItem
            selected={selectedTemplate === TemplateType.Command}
            onClick={() => setSelectedTemplate(TemplateType.Command)}
          >
            <ListItemText inset>Command</ListItemText>
          </MenuItem>
          <MenuItem
            selected={selectedTemplate === TemplateType.Observer}
            onClick={() => setSelectedTemplate(TemplateType.Observer)}
          >
            <ListItemText inset>Obersver</ListItemText>
          </MenuItem>

          <Divider />
          <Typography variant="h6">Creational</Typography>
          <MenuItem
            selected={selectedTemplate === TemplateType.Factory}
            onClick={() => setSelectedTemplate(TemplateType.Factory)}
          >
            <ListItemText inset>Factory</ListItemText>
          </MenuItem>
        </MenuList>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            flex: 1,
            pb: 2,
            px: 2,
          }}
        >
          <Button
            variant="contained"
            onClick={() => {
              console.log(apollon2?.getNodes())
            }}
          >
            Create
          </Button>
        </Box>
      </Paper>
    </Modal>
  )
}
