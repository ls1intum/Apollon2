import { LocationPopover } from "@/types"

export interface PopoverProps {
  nodeId: string
  anchorEl: HTMLElement | null
  open: boolean
  onClose: () => void
  popoverOrigin: LocationPopover
}
