import React, { useEffect, useRef, useState } from "react"
import { AppBar } from "../ui"
import { Box } from "../ui"
import { Toolbar } from "../ui"
import { IconButton } from "../ui"
import { Typography } from "../ui"
import { Menu } from "../ui"
import { MenuIcon } from "../ui"
import { NavbarFile } from "./NavbarFile"
import { NavbarHelp } from "./NavbarHelp"
import { Button } from "../ui"
import { BrandAndVersion } from "./BrandAndVersion"
import { NAVBAR_BACKGROUND_COLOR } from "@/constants"
import { useEditorContext, useModalContext } from "@/contexts"
import { TextField } from "../ui"
import TumLogo from "assets/images/tum-logo.png"
import { useNavigate } from "react-router"

export default function MobileNavbar() {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null)
  const { editor } = useEditorContext()
  const { openModal } = useModalContext()
  const navigate = useNavigate()
  const [diagramTitle, setDiagramTitle] = useState(
    editor?.getDiagramMetadata().diagramTitle || ""
  )
  const unsubscribe = useRef<() => void>()

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

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const goHome = () => {
    navigate("/")
  }
  return (
    <AppBar
      position="static"
      style={{ backgroundColor: NAVBAR_BACKGROUND_COLOR }}
      elevation={0}
    >
      <Toolbar disableGutters>
        <Box
          style={{
            display: "flex",
            flex: 1,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Mobile Menu Button */}
          <Box
            style={{ marginLeft: 16, display: "flex", alignItems: "center" }}
          >
            {/* Logo */}
            <img alt="Logo" src={TumLogo} width="60" height="30" />

            <IconButton
              size="large"
              aria-label="navigation menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                horizontal: "center",
                vertical: "bottom",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
            >
              {/* Interactive Menu Items */}
              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.25,
                  alignItems: "flex-start",
                }}
              >
                <NavbarFile
                  color="black"
                  handleCloseNavMenu={handleCloseNavMenu}
                />
                <Button
                  style={{ textTransform: "none" }} // This removes the uppercase transformation
                  onClick={() => openModal("SHARE")}
                >
                  <Typography color="black">Share</Typography>
                </Button>
                <NavbarHelp color="black" />

                {/* Diagram Name Input Field */}
                <Box style={{ padding: 4 }}>
                  <TextField
                    value={diagramTitle}
                    onChange={(event) => {
                      const newTitle = event.target.value
                      editor?.updateDiagramTitle(newTitle)
                      setDiagramTitle(newTitle)
                    }}
                    placeholder="Diagram Name"
                    fullWidth
                    style={{}}
                    variant="outlined"
                    onClick={(e) => e.stopPropagation()}
                    onFocus={(e) => e.stopPropagation()}
                  />
                </Box>
              </Box>
            </Menu>
          </Box>

          {/* Mobile Title and Version */}
          <div onClick={goHome}>
            <BrandAndVersion />
          </div>

          <div />
        </Box>
      </Toolbar>
    </AppBar>
  )
}
