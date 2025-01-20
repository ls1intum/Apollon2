import { useState, MouseEvent } from "react"
import Button from "@mui/material/Button"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import Typography from "@mui/material/Typography/Typography"
import { secondary } from "../../constants"

export const NavbarHelp = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const open = Boolean(anchorEl)
  const openMenu = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={openMenu}
      >
        <Typography color={secondary}>Help</Typography>
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
        <MenuItem onClick={handleClose}>How does this Editor Work?</MenuItem>
        <MenuItem onClick={handleClose}>About Apollon</MenuItem>
        <MenuItem onClick={handleClose}>Report a Problem</MenuItem>
      </Menu>
    </>
  )
}
