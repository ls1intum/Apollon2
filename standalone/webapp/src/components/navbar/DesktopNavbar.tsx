import { FC, useState } from "react"
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
import { Apollon2 } from "@apollon2/library"

interface Props {
  apollon2?: Apollon2
}

export const DesktopNavbar: FC<Props> = ({ apollon2 }) => {
  const [diagramName, setDiagramName] = useState<string>("")

  return (
    <AppBar
      position="static"
      sx={{ bgcolor: NAVBAR_BACKGROUND_COLOR }}
      elevation={0}
    >
      <Toolbar disableGutters sx={{ ml: 2 }}>
        <img
          alt="Logo"
          src="images/logo.png"
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
          <NavbarFile apollon2={apollon2} />
          <Button
            sx={{ textTransform: "none" }} // This removes the uppercase transformation
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
