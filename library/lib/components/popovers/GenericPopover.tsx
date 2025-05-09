import React, { ReactNode } from "react"
import { Popover, Box, PopoverOrigin } from "@mui/material"

interface GenericPopoverProps {
  id: string
  anchorEl: HTMLElement | SVGSVGElement | null | SVGPathElement
  open: boolean
  onClose: () => void
  children: ReactNode
  anchorOrigin?: PopoverOrigin
  transformOrigin?: PopoverOrigin
  maxHeight?: number
  maxWidth?: number
  style?: React.CSSProperties
}

export const GenericPopover: React.FC<GenericPopoverProps> = ({
  id,
  anchorEl,
  open,
  onClose,
  children,
  anchorOrigin = { vertical: "top", horizontal: "right" },
  transformOrigin = { vertical: "top", horizontal: "left" },
  maxHeight = 500,
  maxWidth = 500,
  style,
}) => (
  <Popover
    id={open ? id : undefined}
    open={open}
    anchorEl={anchorEl}
    onClose={onClose}
    anchorOrigin={anchorOrigin}
    transformOrigin={transformOrigin}
    style={{ maxHeight, maxWidth, ...style }}
    onClick={(e) => {
      e.stopPropagation()
    }}
  >
    <Box
      sx={{
        px: 1,
        py: 1.25,
        display: "flex",
        flexDirection: "column",
        bgcolor: "#f7f9fb",
      }}
    >
      {children}
    </Box>
  </Popover>
)
