import { useState, MouseEvent, FC } from "react"
import Button from "@mui/material/Button"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import Typography from "@mui/material/Typography/Typography"
import { secondary } from "@/constants"
import { useModalContext } from "@/contexts"

interface Props {
  color?: string
}

// bug report url
export const bugReportURL =
  "https://github.com/ls1intum/apollon2/issues/new?labels=bug&template=bug-report.md"

export const NavbarHelp: FC<Props> = ({ color }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const { openModal } = useModalContext()

  const open = Boolean(anchorEl)
  const openMenu = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const openHelpModal = () => {
    openModal("HowToUseModal")
    handleClose()
  }

  const openAboutModal = () => {
    openModal("AboutModal")

    handleClose()
  }

  const openBugReport = () => {
    window.open(bugReportURL, "_blank")
    handleClose()
  }

  return (
    <>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={openMenu}
        sx={{ textTransform: "none" }} // This removes the uppercase transformation
      >
        <Typography color={color ?? secondary}>Help</Typography>
        <KeyboardArrowDownIcon
          sx={{ width: 16, height: 16, color: secondary }}
        />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={openHelpModal}>How does this Editor Work?</MenuItem>
        <MenuItem onClick={openAboutModal}>About Apollon</MenuItem>
        <MenuItem onClick={openBugReport}>Report a Problem</MenuItem>
      </Menu>
    </>
  )
}
