import React, { useState, useRef, useEffect } from "react"

export interface MenuProps {
  id?: string
  anchorEl: HTMLElement | null
  open: boolean
  onClose: () => void
  children: React.ReactNode
  style?: React.CSSProperties
  anchorOrigin?: {
    vertical: "top" | "bottom"
    horizontal: "left" | "center" | "right"
  }
  transformOrigin?: {
    vertical: "top" | "bottom"
    horizontal: "left" | "center" | "right"
  }
  keepMounted?: boolean
  MenuListProps?: Record<string, unknown>
}

export const Menu: React.FC<MenuProps> = ({
  id,
  anchorEl,
  open,
  onClose,
  children,
  style,
  anchorOrigin,
  transformOrigin,
  keepMounted,
  MenuListProps,
}) => {
  const menuRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  // These props are accepted for MUI compatibility but not implemented
  console.debug("Ignoring MUI-specific props:", {
    anchorOrigin,
    transformOrigin,
    keepMounted,
    MenuListProps,
  })

  useEffect(() => {
    if (open && anchorEl && menuRef.current) {
      const anchorRect = anchorEl.getBoundingClientRect()
      const menuRect = menuRef.current.getBoundingClientRect()

      let top = anchorRect.bottom + window.scrollY
      let left = anchorRect.left + window.scrollX

      // Keep menu within viewport
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      if (left + menuRect.width > viewportWidth) {
        left = viewportWidth - menuRect.width - 8
      }
      if (left < 8) {
        left = 8
      }
      if (top + menuRect.height > viewportHeight) {
        top = anchorRect.top + window.scrollY - menuRect.height
      }
      if (top < 8) {
        top = 8
      }

      setPosition({ top, left })
    }
  }, [open, anchorEl])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        open &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
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
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1300,
        pointerEvents: "none",
      }}
    >
      <div
        ref={menuRef}
        id={id}
        style={{
          position: "fixed",
          top: position.top,
          left: position.left,
          backgroundColor: "white",
          borderRadius: "4px",
          boxShadow:
            "0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)",
          pointerEvents: "auto",
          minWidth: "160px",
          maxHeight: "90vh",
          overflow: "auto",
          outline: 0,
          ...style,
        }}
      >
        {children}
      </div>
    </div>
  )
}
