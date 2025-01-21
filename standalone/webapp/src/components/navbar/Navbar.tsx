import { useTheme } from "@mui/material/styles"
import useMediaQuery from "@mui/material/useMediaQuery"
import MobileNavbar from "./MobileNavbar"
import { DesktopNavbar } from "./DesktopNavbar"
import { Apollon2 } from "@apollon2/library"
import { FC } from "react"

interface Props {
  apollon2?: Apollon2
}
export const Navbar: FC<Props> = ({ apollon2 }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  return isMobile ? <MobileNavbar /> : <DesktopNavbar apollon2={apollon2} />
}
