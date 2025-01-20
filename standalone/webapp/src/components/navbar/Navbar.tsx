import { useTheme } from "@mui/material/styles"
import useMediaQuery from "@mui/material/useMediaQuery"
import MobileNavbar from "./MobileNavbar"
import DesktopNavbar from "./DesktopNavbar"

export function Navbar() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  return isMobile ? <MobileNavbar /> : <DesktopNavbar />
}
