import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import { TextField } from "@mui/material"
import { NavbarFile } from "./NavbarFile"
import { NavbarHelp } from "./NavbarHelp"
import { BrandAndVersion } from "./BrandAndVersion"
import { NAVBAR_BACKGROUND_COLOR, secondary } from "@/constants"
import TumLogo from "assets/images/tum-logo.png"
import { useEffect, useRef, useState } from "react"
import { useModalContext, useEditorContext } from "@/contexts"

export const DesktopNavbar = () => {
  const { editor } = useEditorContext()
  const [diagramTitle, setDiagramTitle] = useState(
    editor?.getDiagramMetadata().diagramTitle || ""
  )
  const unsubscribe = useRef<() => void>()
  const { openModal } = useModalContext()

  useEffect(() => {
    if (editor && !unsubscribe.current) {
      unsubscribe.current = editor.subscribeToDiagramNameChange(
        (diagramTitle) => {
          setDiagramTitle(diagramTitle)
        }
      )
    }
    // Update diagram title when editor is available
    if (editor) {
      setDiagramTitle(editor.getDiagramMetadata().diagramTitle || "")
    }
    // Cleanup subscription
    return () => {
      unsubscribe.current?.()
    }
  }, [editor])

  return (
    <AppBar
      position="static"
      sx={{ bgcolor: NAVBAR_BACKGROUND_COLOR }}
      elevation={0}
    >
      <Toolbar disableGutters sx={{ ml: 2 }}>
        <img
          alt="Logo"
          src={TumLogo}
          width="60"
          height="30"
          style={{ marginRight: 10 }}
        />

        <BrandAndVersion />

        {/* Spacer */}
        <Box
          sx={{
            flexGrow: 1,
            alignItems: "center",
          }}
        >
          <NavbarFile />
          <Button
            sx={{ textTransform: "none" }} // This removes the uppercase transformation
            onClick={() => openModal("SHARE")}
          >
            <Typography color={secondary}>Share</Typography>
          </Button>
          <NavbarHelp />
          <TextField
            sx={{ input: { color: "white", padding: 1 }, marginLeft: 1 }}
            value={diagramTitle}
            onChange={(event) => {
              const newTitle = event.target.value
              editor?.updateDiagramTitle(newTitle)
              setDiagramTitle(newTitle)
            }}
            placeholder="Diagram Name"
            variant="outlined"
          />
        </Box>
      </Toolbar>
    </AppBar>
  )
}
