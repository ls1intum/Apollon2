import React, { useState } from "react"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import Menu from "@mui/material/Menu"
import MenuIcon from "@mui/icons-material/Menu"
import Container from "@mui/material/Container"
import { TextField } from "@mui/material"
import { NavbarFile } from "./NavbarFile"
import { NavbarHelp } from "./NavbarHelp"
import { secondary } from "../../constants"
import Button from "@mui/material/Button/Button"

const NAVBAR_BACKGROUND_COLOR = "#212529"

export default function MobileNavbar() {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null)
  const [diagramName, setDiagramName] = useState<string>("")

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
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo */}
          <img
            alt="Logo"
            src="images/logo.png"
            width="60"
            height="30"
            style={{ marginRight: 10 }}
          />

          <Box
            sx={{
              display: "flex",
              flex: 1,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* Mobile Menu Button */}
            <Box>
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
                sx={{ display: { xs: "block", md: "none" } }}
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
                  <NavbarFile />

                  <Button
                    id="basic-button"
                    onClick={() => {
                      console.log("SHARE button is clicked")
                    }}
                  >
                    <Typography color={secondary}>Share</Typography>
                  </Button>

                  <NavbarHelp />

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
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h5"
                noWrap
                sx={{
                  mr: 2,
                  flexGrow: 1,
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                }}
              >
                Apollon2
              </Typography>
              <Typography variant="body2" sx={{ color: secondary }}>
                v0.0.1
              </Typography>
            </Box>

            <div />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
