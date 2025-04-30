import React, { ReactNode } from "react"
import { Popover, Box, PopoverOrigin } from "@mui/material"

interface GenericPopoverProps {
  id: string
  anchorEl: HTMLElement | SVGSVGElement | null
  open: boolean
  onClose: () => void
  children: ReactNode
  anchorOrigin?: PopoverOrigin
  transformOrigin?: PopoverOrigin
  maxHeight?: number
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
  style,
}) => (
  <Popover
    id={open ? id : undefined}
    open={open}
    anchorEl={anchorEl}
    onClose={onClose}
    anchorOrigin={anchorOrigin}
    transformOrigin={transformOrigin}
    style={{ maxHeight, ...style }}
    onClick={(e) => {
      e.stopPropagation()
    }}
  >
    <Box
      sx={{
        p: 1,
        display: "flex",
        flexDirection: "column",
        gap: 0.5,
        bgcolor: "#F8F9FA",
      }}
    >
      {children}
    </Box>
  </Popover>
)
