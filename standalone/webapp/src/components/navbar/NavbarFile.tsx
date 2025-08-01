import { useState, MouseEvent, FC, useCallback } from "react"
import { Button } from "../ui"
import { Menu } from "../ui"
import { MenuItem } from "../ui"
import { KeyboardArrowDownIcon } from "../ui"
import { KeyboardArrowRightIcon } from "../ui"
import { Typography } from "../ui"
import { secondary } from "@/constants"
import { useModalContext } from "@/contexts"
import {
  useExportAsJSON,
  useExportAsPNG,
  useExportAsSVG,
  useExportAsPDF,
} from "@/hooks"
import { JsonFileImportButton } from "./JsonFileImportButton"

interface Props {
  color?: string
  handleCloseNavMenu?: () => void
}

export const NavbarFile: FC<Props> = ({ color, handleCloseNavMenu }) => {
  const { openModal } = useModalContext()
  const exportAsSvg = useExportAsSVG()
  const exportAsPng = useExportAsPNG()
  const exportAsJSON = useExportAsJSON()
  const exportAsPDF = useExportAsPDF()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [subMenuAnchorEl, setSubMenuAnchorEl] = useState<null | HTMLElement>(
    null
  )

  const isMenuOpen = Boolean(anchorEl)
  const isSubMenuOpen = Boolean(subMenuAnchorEl)

  const openMainMenu = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }, [])

  const closeMainMenu = useCallback(() => {
    handleCloseNavMenu?.()
    setAnchorEl(null)
    setSubMenuAnchorEl(null)
  }, [])

  const openSubMenu = useCallback((event: MouseEvent<HTMLElement>) => {
    setSubMenuAnchorEl(event.currentTarget)
  }, [])

  const handleNewFile = useCallback(() => {
    openModal("NEW_DIAGRAM")
    closeMainMenu()
  }, [openModal, closeMainMenu])

  const handleStartFromTemplate = useCallback(() => {
    openModal("NEW_DIAGRAM_FROM_TEMPLATE")
    closeMainMenu()
  }, [closeMainMenu])

  return (
    <>
      <Button
        id="file-menu-button"
        aria-controls={isMenuOpen ? "file-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={isMenuOpen ? "true" : undefined}
        onClick={openMainMenu}
        style={{
          textTransform: "none",
        }}
      >
        <Typography color={color ?? secondary} component="span">
          File
        </Typography>
        <KeyboardArrowDownIcon
          style={{ width: 16, height: 16, color: secondary, marginLeft: 4 }}
        />
      </Button>
      <Menu
        id="file-menu"
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={closeMainMenu}
        MenuListProps={{
          "aria-labelledby": "file-menu-button",
        }}
      >
        <MenuItem onClick={handleNewFile}>New File</MenuItem>
        <MenuItem onClick={handleStartFromTemplate}>
          Start from Template
        </MenuItem>
        <MenuItem onClick={() => openModal("LOAD_DIAGRAM")}>
          Load Diagram
        </MenuItem>
        <JsonFileImportButton />
        <MenuItem
          onClick={openSubMenu}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          aria-haspopup="true"
          aria-controls={isSubMenuOpen ? "export-sub-menu" : undefined}
          aria-expanded={isSubMenuOpen ? "true" : undefined}
        >
          Export
          <KeyboardArrowRightIcon />
        </MenuItem>
      </Menu>
      <Menu
        id="export-sub-menu"
        anchorEl={subMenuAnchorEl}
        open={isSubMenuOpen}
        onClose={closeMainMenu}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        MenuListProps={{
          "aria-labelledby": "export-sub-menu-button",
        }}
      >
        <MenuItem onClick={exportAsSvg}>As SVG</MenuItem>
        <MenuItem onClick={() => exportAsPng({ setWhiteBackground: true })}>
          As PNG (White Background)
        </MenuItem>
        <MenuItem onClick={() => exportAsPng({ setWhiteBackground: false })}>
          As PNG (Transparent Background)
        </MenuItem>
        <MenuItem onClick={exportAsJSON}>As JSON</MenuItem>
        <MenuItem onClick={exportAsPDF}>As PDF</MenuItem>
      </Menu>
    </>
  )
}
