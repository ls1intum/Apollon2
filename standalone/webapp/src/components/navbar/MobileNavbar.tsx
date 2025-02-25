import React, { useState } from "react"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import Menu from "@mui/material/Menu"
import MenuIcon from "@mui/icons-material/Menu"
import { NavbarFile } from "./NavbarFile"
import { NavbarHelp } from "./NavbarHelp"
import Button from "@mui/material/Button/Button"
import { BrandAndVersion } from "./BrandAndVersion"
import { NAVBAR_BACKGROUND_COLOR } from "@/constants"
import { useApollon2Context } from "@/contexts/Apollon2Context"
import TextField from "@mui/material/TextField/TextField"

export default function MobileNavbar() {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null)
  const { diagramName, setDiagramName, apollon2 } = useApollon2Context()
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  return (
    <AppBar
      position="static"
      sx={{ bgcolor: NAVBAR_BACKGROUND_COLOR }}
      elevation={0}
    >
      <Toolbar disableGutters>
        <Box
          sx={{
            display: "flex",
            flex: 1,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Mobile Menu Button */}
          <Box sx={{ ml: 2, display: "flex", alignItems: "center" }}>
            {/* Logo */}
            <img
              alt="Logo"
              src="assets/images/tum-logo.png"
              width="60"
              height="30"
            />

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
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.25,
                  alignItems: "flex-start",
                }}
              >
                <NavbarFile color="black" />
                <Button
                  sx={{ textTransform: "none" }} // This removes the uppercase transformation
                  onClick={() =>
                    console.log("DEBUG share getnodes,", apollon2?.getNodes())
                  }
                >
                  <Typography color="black">Share</Typography>
                </Button>
                <NavbarHelp color="black" />

                {/* Diagram Name Input Field */}
                <Box sx={{ p: 0.5 }}>
                  <TextField
                    value={diagramName}
                    onChange={(event) => setDiagramName(event.target.value)}
                    placeholder="Diagram Name"
                    fullWidth
                    sx={{ input: { padding: 0.5 } }}
                    variant="outlined"
                    // Prevent menu from closing when clicking inside the TextField
                    onClick={(e) => e.stopPropagation()}
                    onFocus={(e) => e.stopPropagation()}
                  />
                </Box>
              </Box>
            </Menu>
          </Box>

          {/* Mobile Title and Version */}
          <BrandAndVersion />

          <div />
        </Box>
      </Toolbar>
    </AppBar>
  )
}
