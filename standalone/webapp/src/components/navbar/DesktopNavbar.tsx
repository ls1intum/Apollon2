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
import { useApollon2Context } from "@/contexts/Apollon2Context"

export const DesktopNavbar = () => {
  const { diagramName, setDiagramName, apollon2 } = useApollon2Context()

  return (
    <AppBar
      position="static"
      sx={{ bgcolor: NAVBAR_BACKGROUND_COLOR }}
      elevation={0}
    >
      <Toolbar disableGutters sx={{ ml: 2 }}>
        <img
          alt="Logo"
          src="assets/images/logo.png"
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
            onClick={() =>
              console.log("DEBUG share getnodes,", apollon2?.getNodes())
            }
          >
            <Typography color={secondary}>Share</Typography>
          </Button>
          <NavbarHelp />
          <TextField
            sx={{ input: { color: "white", padding: 1 }, marginLeft: 1 }}
            value={diagramName}
            onChange={(event) => setDiagramName(event.target.value)}
            placeholder="Diagram Name"
            variant="outlined"
          />
        </Box>
      </Toolbar>
    </AppBar>
  )
}
