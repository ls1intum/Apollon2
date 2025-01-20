import { useState } from "react"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import Container from "@mui/material/Container"
import Button from "@mui/material/Button"
import { TextField } from "@mui/material"
import { NavbarFile } from "./NavbarFile"
import { NavbarHelp } from "./NavbarHelp"
import { secondary } from "../../constants"

const NAVBAR_BACKGROUND_COLOR = "#212529"

export default function DesktopNavbar() {
  const [diagramName, setDiagramName] = useState<string>("")

  return (
    <AppBar
      position="static"
      sx={{ bgcolor: NAVBAR_BACKGROUND_COLOR }}
      elevation={0}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <img
            alt="Logo"
            src="images/logo.png"
            width="60"
            height="30"
            style={{ marginRight: 10 }}
          />

          <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontWeight: 700,
              color: "inherit",
            }}
          >
            Apollon2
          </Typography>
          <Typography
            variant="body2"
            sx={{ display: { xs: "none", md: "flex" }, color: secondary }}
          >
            v0.0.1
          </Typography>

          {/* Spacer */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              alignItems: "center",
            }}
          >
            <NavbarFile />
            <Button onClick={() => console.log("Share Clicked")}>
              <Typography color={secondary}>Share</Typography>
            </Button>
            <NavbarHelp />
            <TextField
              sx={{ input: { color: "white", padding: 1 }, marginLeft: 2 }}
              value={diagramName}
              onChange={(event) => setDiagramName(event.target.value)}
              placeholder="Diagram Name"
              variant="standard"
              InputProps={{
                disableUnderline: true,
              }}
            />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
