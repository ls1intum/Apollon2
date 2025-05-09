import { LocationPopover } from "@/types"

export interface PopoverProps {
  nodeId: string
  anchorEl: HTMLElement | null
  open: boolean
  onClose: () => void
  popoverOrigin: LocationPopover
}

export interface EdgePopoverProps {
  source: string
  target: string
  edgeId: string
  anchorEl: HTMLElement | SVGSVGElement | null | SVGPathElement
  open: boolean
  onClose: () => void
}
