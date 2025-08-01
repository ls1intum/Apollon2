import { useState, MouseEvent, FC } from "react"
import { Button } from "../ui"
import { Menu } from "../ui"
import { MenuItem } from "../ui"
import { KeyboardArrowDownIcon } from "../ui"
import { Typography } from "../ui"
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
        style={{ textTransform: "none" }} // This removes the uppercase transformation
      >
        <Typography color={color ?? secondary}>Help</Typography>
        <KeyboardArrowDownIcon
          style={{ width: 16, height: 16, color: secondary }}
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
