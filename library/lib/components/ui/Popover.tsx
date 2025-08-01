import { ReactNode, useRef, useEffect, useState } from "react"
import "./Popover.css"

export interface PopoverOrigin {
  vertical: "top" | "center" | "bottom"
  horizontal: "left" | "center" | "right"
}

export interface PopoverProps {
  id?: string
  open: boolean
  anchorEl: HTMLElement | SVGSVGElement | SVGPathElement | null
  onClose: () => void
  children: ReactNode
  anchorOrigin?: PopoverOrigin
  transformOrigin?: PopoverOrigin
  style?: React.CSSProperties
  onClick?: (event: React.MouseEvent) => void
}

export const Popover: React.FC<PopoverProps> = ({
  id,
  open,
  anchorEl,
  onClose,
  children,
  anchorOrigin = { vertical: "bottom", horizontal: "left" },
  transformOrigin = { vertical: "top", horizontal: "left" },
  style,
  onClick,
}) => {
  const popoverRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  useEffect(() => {
    if (open && anchorEl && popoverRef.current) {
      const anchorRect = anchorEl.getBoundingClientRect()
      const popoverRect = popoverRef.current.getBoundingClientRect()

      let top = 0
      let left = 0

      // Calculate position based on anchor origin
      switch (anchorOrigin.vertical) {
        case "top":
          top = anchorRect.top
          break
        case "center":
          top = anchorRect.top + anchorRect.height / 2
          break
        case "bottom":
          top = anchorRect.bottom
          break
      }

      switch (anchorOrigin.horizontal) {
        case "left":
          left = anchorRect.left
          break
        case "center":
          left = anchorRect.left + anchorRect.width / 2
          break
        case "right":
          left = anchorRect.right
          break
      }

      // Adjust based on transform origin
      switch (transformOrigin.vertical) {
        case "center":
          top -= popoverRect.height / 2
          break
        case "bottom":
          top -= popoverRect.height
          break
      }

      switch (transformOrigin.horizontal) {
        case "center":
          left -= popoverRect.width / 2
          break
        case "right":
          left -= popoverRect.width
          break
      }

      // Keep popover within viewport
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      if (left + popoverRect.width > viewportWidth) {
        left = viewportWidth - popoverRect.width - 8
      }
      if (left < 8) {
        left = 8
      }
      if (top + popoverRect.height > viewportHeight) {
        top = viewportHeight - popoverRect.height - 8
      }
      if (top < 8) {
        top = 8
      }

      setPosition({ top, left })
    }
  }, [open, anchorEl, anchorOrigin, transformOrigin])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        open &&
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        anchorEl &&
        !anchorEl.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (open && event.key === "Escape") {
        onClose()
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [open, onClose, anchorEl])

  if (!open) {
    return null
  }

  return (
    <div className="popover-backdrop">
      <div
        ref={popoverRef}
        id={id}
        className="popover-container"
        style={{
          position: "fixed",
          top: position.top,
          left: position.left,
          zIndex: 1300,
          ...style,
        }}
        onClick={onClick}
      >
        {children}
      </div>
    </div>
  )
}
