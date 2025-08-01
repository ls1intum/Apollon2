import { useState, useEffect } from "react"
import MobileNavbar from "./MobileNavbar"
import { DesktopNavbar } from "./DesktopNavbar"

export const Navbar = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768) // md breakpoint equivalent
    }

    checkDevice()
    window.addEventListener("resize", checkDevice)

    return () => window.removeEventListener("resize", checkDevice)
  }, [])

  return isMobile ? <MobileNavbar /> : <DesktopNavbar />
}
