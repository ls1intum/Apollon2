import { useState, MouseEvent, FC } from "react"
import Button from "@mui/material/Button"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight"
import Typography from "@mui/material/Typography"
import { secondary } from "@/constants"
import { Apollon2 } from "@apollon2/library"

interface Props {
  color?: string
  apollon2?: Apollon2
}

export const NavbarFile: FC<Props> = ({ color, apollon2 }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [secondItemAnchorEl, setSecondItemAnchorEl] =
    useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const openMenu = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const closeMenu = () => {
    setAnchorEl(null)
    setSecondItemAnchorEl(null)
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
        <Typography color={color ?? secondary} autoCapitalize="">
          File
        </Typography>
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
        <MenuItem
          onClick={() => {
            console.log("New File")
            console.log("apollon2", apollon2)
            if (apollon2) {
              apollon2.resetDiagram()
            }
            handleClose()
          }}
        >
          New File
        </MenuItem>
        <MenuItem onClick={handleClose}>Start from Template</MenuItem>
        <MenuItem onClick={handleClose}>Load</MenuItem>
        <MenuItem onClick={handleClose}>Import</MenuItem>
        <MenuItem
          onClick={(event) => {
            setSecondItemAnchorEl(event.currentTarget)
          }}
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          Export
          <KeyboardArrowRightIcon />
        </MenuItem>
      </Menu>
      <Menu
        id="sub-menu"
        anchorEl={secondItemAnchorEl}
        open={Boolean(secondItemAnchorEl)}
        onClose={closeMenu}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <MenuItem onClick={closeMenu}>As SVG</MenuItem>
        <MenuItem onClick={closeMenu}>As PNG(White background)</MenuItem>
        <MenuItem onClick={closeMenu}>As PNG(Transparent background)</MenuItem>
        <MenuItem onClick={closeMenu}>As JSON</MenuItem>
        <MenuItem onClick={closeMenu}>As PDF</MenuItem>
      </Menu>
    </>
  )
}
