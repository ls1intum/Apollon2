import React, { useEffect, useRef } from "react"

export interface PopoverOrigin {
  vertical: "top" | "center" | "bottom"
  horizontal: "left" | "center" | "right"
}

interface PopoverProps {
  open: boolean
  onClose: () => void
  anchorEl?: HTMLElement | null
  children: React.ReactNode
  anchorOrigin?: PopoverOrigin
  transformOrigin?: PopoverOrigin
  className?: string
  style?: React.CSSProperties
  id?: string
  onClick?: (e: React.MouseEvent) => void
}

export const Popover: React.FC<PopoverProps> = ({
  open,
  onClose,
  anchorEl,
  children,
  anchorOrigin = { vertical: "bottom", horizontal: "left" },
  transformOrigin = { vertical: "top", horizontal: "left" },
  className = "",
  style = {},
  id,
  onClick,
}) => {
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
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
  }, [open, onClose])

  const getPosition = (): React.CSSProperties => {
    if (!anchorEl) return { top: 0, left: 0 }

    const anchorRect = anchorEl.getBoundingClientRect()
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft

    let top = anchorRect.top + scrollTop
    let left = anchorRect.left + scrollLeft

    // Adjust based on anchor origin
    switch (anchorOrigin.vertical) {
      case "center":
        top += anchorRect.height / 2
        break
      case "bottom":
        top += anchorRect.height
        break
    }

    switch (anchorOrigin.horizontal) {
      case "center":
        left += anchorRect.width / 2
        break
      case "right":
        left += anchorRect.width
        break
    }

    return { top, left }
  }

  const getTransform = (): string => {
    let translateX = "0%"
    let translateY = "0%"

    switch (transformOrigin.horizontal) {
      case "center":
        translateX = "-50%"
        break
      case "right":
        translateX = "-100%"
        break
    }

    switch (transformOrigin.vertical) {
      case "center":
        translateY = "-50%"
        break
      case "bottom":
        translateY = "-100%"
        break
    }

    return `translate(${translateX}, ${translateY})`
  }

  if (!open) return null

  const position = getPosition()
  const transform = getTransform()

  const popoverStyles: React.CSSProperties = {
    position: "absolute",
    zIndex: 1300,
    backgroundColor: "white",
    borderRadius: "4px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
    border: "1px solid #e0e0e0",
    transform,
    ...position,
    ...style,
  }

  return (
    <div
      ref={popoverRef}
      className={className}
      style={popoverStyles}
      id={id}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
