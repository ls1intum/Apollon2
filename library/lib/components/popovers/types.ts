export interface PopoverProps {
  elementId: string
}

export interface EdgePopoverProps {
  source: string
  target: string
  edgeId: string
  anchorEl: HTMLElement | SVGSVGElement | null | SVGPathElement
  open: boolean
  onClose: () => void
}
