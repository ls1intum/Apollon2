import { useState } from "react"
import { Panel } from "@xyflow/react"
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight"
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft"
import List from "@mui/material/List"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Collapse from "@mui/material/Collapse"
import ExpandLess from "@mui/icons-material/ExpandLess"
import ExpandMore from "@mui/icons-material/ExpandMore"
import IosShareOutlinedIcon from "@mui/icons-material/IosShareOutlined"
import FilePresentOutlinedIcon from "@mui/icons-material/FilePresentOutlined"
import AddOutlinedIcon from "@mui/icons-material/AddOutlined"
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined"
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined"
import Box from "@mui/material/Box/Box"
import TextField from "@mui/material/TextField/TextField"
import ShareRoundedIcon from "@mui/icons-material/ShareRounded"
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined"

export const ActionsPanel = () => {
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(true)
  const [isExportListOpen, setIsExportListOpen] = useState(false)
  const [isHelpListOpen, setIsHelpListOpen] = useState(false)
  const [diagramName, setDiagramName] = useState("")

  const handleExportListClick = () => {
    setIsExportListOpen((prev) => !prev)
  }
  const handleHelpListClick = () => {
    setIsHelpListOpen((prev) => !prev)
  }

  return (
    <Panel position="top-left">
      {isMenuCollapsed ? (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <KeyboardArrowRightIcon
            onClick={() => {
              setIsMenuCollapsed(false)
            }}
          />
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Box sx={{ display: "flex" }}>
            <KeyboardArrowLeftIcon
              onClick={() => {
                setIsMenuCollapsed(true)
              }}
            />
            <TextField
              placeholder="Diagram Name"
              variant="outlined"
              size="small"
              value={diagramName}
              onChange={(event) => setDiagramName(event.target.value)}
            />
          </Box>
          <List
            sx={{
              width: "100%",
              maxWidth: 360,
            }}
            dense
          >
            <ListItemButton disableGutters>
              <ListItemIcon sx={listIconStyle}>
                <AddOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="New" />
            </ListItemButton>
            <ListItemButton disableGutters divider>
              <ListItemIcon sx={listIconStyle}>
                <FilePresentOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Start from Template" />
            </ListItemButton>
            <ListItemButton disableGutters>
              <ListItemIcon sx={listIconStyle}>
                <UploadFileOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Load" />
            </ListItemButton>
            <ListItemButton disableGutters>
              <ListItemIcon sx={listIconStyle}>
                <IosShareOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Import" />
            </ListItemButton>
            <ListItemButton disableGutters onClick={handleExportListClick}>
              <ListItemIcon sx={listIconStyle}>
                <FileDownloadOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Export" />
              {isExportListOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={isExportListOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding dense>
                <ListItemButton disableGutters sx={{ pl: 2 }}>
                  <ListItemText primary="As SVG" />
                </ListItemButton>
                <ListItemButton disableGutters sx={{ pl: 2 }}>
                  <ListItemText primary="As PNG (White Background)" />
                </ListItemButton>
                <ListItemButton disableGutters sx={{ pl: 2 }}>
                  <ListItemText primary="As PNG (Transparent Background)" />
                </ListItemButton>
                <ListItemButton disableGutters sx={{ pl: 2 }}>
                  <ListItemText primary="As JSON" />
                </ListItemButton>
                <ListItemButton disableGutters sx={{ pl: 2 }}>
                  <ListItemText primary="As PDF" />
                </ListItemButton>
              </List>
            </Collapse>
            <ListItemButton disableGutters>
              <ListItemIcon sx={listIconStyle}>
                <ShareRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="Share" />
            </ListItemButton>

            <ListItemButton disableGutters onClick={handleHelpListClick}>
              <ListItemIcon sx={listIconStyle}>
                <HelpOutlineOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Help" />
              {isHelpListOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={isHelpListOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding dense>
                <ListItemButton disableGutters sx={{ pl: 2 }}>
                  <ListItemText primary="How does this Editor work?" />
                </ListItemButton>
                <ListItemButton disableGutters sx={{ pl: 2 }}>
                  <ListItemText primary="About Apollon" />
                </ListItemButton>
                <ListItemButton disableGutters sx={{ pl: 2 }}>
                  <ListItemText primary="Report a Problem" />
                </ListItemButton>
              </List>
            </Collapse>
          </List>
        </Box>
      )}
    </Panel>
  )
}

const listIconStyle = {
  minWidth: 44,
}
