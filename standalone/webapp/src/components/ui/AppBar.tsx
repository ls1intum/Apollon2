import React from "react"

export interface AppBarProps {
  position?: "fixed" | "absolute" | "sticky" | "static" | "relative"
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  elevation?: number
}

export const AppBar: React.FC<AppBarProps> = ({
  position = "static",
  children,
  className = "",
  style,
  elevation = 4,
}) => {
  const getBoxShadow = (elevation: number) => {
    if (elevation === 0) return "none"
    const shadows = [
      "none",
      "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
      "0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)",
      "0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)",
      "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
    ]
    return (
      shadows[Math.min(elevation, shadows.length - 1)] ||
      shadows[shadows.length - 1]
    )
  }

  return (
    <div
      className={`app-bar app-bar-${position} ${className}`}
      style={{
        position: position,
        top: position === "fixed" || position === "absolute" ? 0 : undefined,
        left: position === "fixed" || position === "absolute" ? 0 : undefined,
        right: position === "fixed" || position === "absolute" ? 0 : undefined,
        backgroundColor: "#1976d2",
        color: "white",
        boxShadow: getBoxShadow(elevation),
        zIndex: 1100,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
