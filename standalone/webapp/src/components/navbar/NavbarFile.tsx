import { useState, MouseEvent, FC, useCallback, useRef } from "react"
import Button from "@mui/material/Button"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight"
import Typography from "@mui/material/Typography"

import { secondary } from "@/constants"
import { useModalContext } from "@/contexts/ModalContext"
import { useApollon2Context } from "@/contexts"

import { useImportHandler } from "@/hooks/useImportHandler"
import { HiddenFileInput } from "./HiddenFileInput"
import { SnackbarMessage } from "./SnackbarMessage"

enum ExportType {
  SVG = "SVG",
  PNG_WHITE = "PNG_WHITE",
  PNG_TRANSPARENT = "PNG_TRANSPARENT",
  JSON = "JSON",
  PDF = "PDF",
}

interface Props {
  color?: string
}

export const NavbarFile: FC<Props> = ({ color }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [subMenuAnchorEl, setSubMenuAnchorEl] = useState<null | HTMLElement>(
    null
  )
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const { openModal } = useModalContext()
  const { apollon2, diagramName } = useApollon2Context()

  const { errorMessage, snackbarOpen, handleImport, handleSnackbarClose } =
    useImportHandler()

  const isMenuOpen = Boolean(anchorEl)
  const isSubMenuOpen = Boolean(subMenuAnchorEl)

  const openMainMenu = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }, [])

  const closeMainMenu = useCallback(() => {
    setAnchorEl(null)
    setSubMenuAnchorEl(null)
  }, [])

  const openSubMenu = useCallback((event: MouseEvent<HTMLElement>) => {
    setSubMenuAnchorEl(event.currentTarget)
  }, [])

  const handleExport = useCallback(
    (type: ExportType) => {
      if (!apollon2 || !diagramName) {
        console.error("Apollon2 context is not available")
        closeMainMenu()
        return
      }

      switch (type) {
        case ExportType.SVG:
          apollon2.exportImageAsSVG(diagramName)
          break
        case ExportType.PNG_WHITE:
          apollon2.exportImagePNG(diagramName, false)
          break
        case ExportType.PNG_TRANSPARENT:
          apollon2.exportImagePNG(diagramName, true)
          break
        case ExportType.JSON:
          apollon2.exportAsJson(diagramName)
          break
        case ExportType.PDF:
          apollon2.exportImageAsPDF(diagramName)
          break
        default:
          console.warn(`Unknown export type: ${type}`)
      }

      closeMainMenu()
    },
    [apollon2, diagramName, closeMainMenu]
  )

  const handleNewFile = useCallback(() => {
    openModal("NEW_DIAGRAM")
    closeMainMenu()
  }, [openModal, closeMainMenu])

  const handleStartFromTemplate = useCallback(() => {
    openModal("NEW_DIAGRAM_FROM_TEMPLATE")
    closeMainMenu()
  }, [closeMainMenu])

  const handleImportClick = useCallback(() => {
    // Trigger the hidden file input click
    fileInputRef.current?.click()
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
        sx={{
          textTransform: "none",
        }}
      >
        <Typography color={color ?? secondary} component="span">
          File
        </Typography>
        <KeyboardArrowDownIcon
          sx={{ width: 16, height: 16, color: secondary, ml: 0.5 }}
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
        <MenuItem onClick={handleImportClick}>Import</MenuItem>
        <MenuItem
          onClick={openSubMenu}
          sx={{
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
        <MenuItem onClick={() => handleExport(ExportType.SVG)}>As SVG</MenuItem>
        <MenuItem onClick={() => handleExport(ExportType.PNG_WHITE)}>
          As PNG (White Background)
        </MenuItem>
        <MenuItem onClick={() => handleExport(ExportType.PNG_TRANSPARENT)}>
          As PNG (Transparent Background)
        </MenuItem>
        <MenuItem onClick={() => handleExport(ExportType.JSON)}>
          As JSON
        </MenuItem>
        <MenuItem onClick={() => handleExport(ExportType.PDF)}>As PDF</MenuItem>
      </Menu>

      {/* Hidden File Input for Import */}
      <HiddenFileInput inputRef={fileInputRef} onFileChange={handleImport} />

      {/* Snackbar for Error Messages */}
      <SnackbarMessage
        open={snackbarOpen}
        message={errorMessage}
        severity="error"
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      />
    </>
  )
}
