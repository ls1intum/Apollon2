import { AppBar } from "../ui"
import { Box } from "../ui"
import { Toolbar } from "../ui"
import { Typography } from "../ui"
import { Button } from "../ui"
import { TextField } from "../ui"
import { NavbarFile } from "./NavbarFile"
import { NavbarHelp } from "./NavbarHelp"
import { BrandAndVersion } from "./BrandAndVersion"
import { NAVBAR_BACKGROUND_COLOR, secondary } from "@/constants"
import TumLogo from "assets/images/tum-logo.png"
import { useEffect, useRef, useState } from "react"
import { useModalContext, useEditorContext } from "@/contexts"
import { useNavigate } from "react-router"

export const DesktopNavbar = () => {
  const { editor } = useEditorContext()
  const [diagramTitle, setDiagramTitle] = useState(
    editor?.getDiagramMetadata().diagramTitle || ""
  )
  const unsubscribe = useRef<() => void>()
  const { openModal } = useModalContext()
  const navigate = useNavigate()

  const goHome = () => {
    navigate("/")
  }
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
      style={{ backgroundColor: NAVBAR_BACKGROUND_COLOR }}
      elevation={0}
    >
      <Toolbar disableGutters style={{ marginLeft: 16 }}>
        <div
          onClick={goHome}
          style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
        >
          <img
            alt="Logo"
            src={TumLogo}
            width="60"
            height="30"
            style={{ marginRight: 10 }}
          />

          <BrandAndVersion />
        </div>

        {/* Spacer */}
        <Box
          style={{
            flexGrow: 1,
            alignItems: "center",
          }}
        >
          <NavbarFile />
          <Button
            style={{ textTransform: "none" }} // This removes the uppercase transformation
            onClick={() => openModal("SHARE")}
          >
            <Typography color={secondary}>Share</Typography>
          </Button>
          <NavbarHelp />
          <TextField
            style={{ marginLeft: 8 }}
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
