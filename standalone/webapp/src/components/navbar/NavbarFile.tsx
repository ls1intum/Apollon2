import { useState, MouseEvent, FC, useCallback, useRef } from "react"
import Button from "@mui/material/Button"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight"
import Typography from "@mui/material/Typography"
import { secondary } from "@/constants"
import { useModalContext } from "@/contexts"
import { useImportHandler } from "@/hooks/useImportHandler"
import { HiddenFileInput } from "./HiddenFileInput"
import { SnackbarMessage } from "./SnackbarMessage"
import {
  useExportAsJSON,
  useExportAsPNG,
  useExportAsSVG,
  useExportAsPDF,
} from "@/hooks"

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
  const { errorMessage, snackbarOpen, handleImport, handleSnackbarClose } =
    useImportHandler()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

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
        <MenuItem onClick={() => openModal("LOAD_DIAGRAM")}>
          Load Diagram
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
