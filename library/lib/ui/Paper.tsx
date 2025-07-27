import React from "react"

interface PaperProps {
  children?: React.ReactNode
  elevation?: number
  variant?: "elevation" | "outlined"
  className?: string
  style?: React.CSSProperties
  component?: React.ElementType
}

export const Paper: React.FC<PaperProps> = ({
  children,
  elevation = 1,
  variant = "elevation",
  className = "",
  style = {},
  component: Component = "div",
}) => {
  const getElevationShadow = (elevation: number): string => {
    const shadows = [
      "none",
      "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
      "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
      "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
      "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
      "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)",
    ]
    return shadows[Math.min(elevation, shadows.length - 1)]
  }

  const paperStyles: React.CSSProperties = {
    backgroundColor: "white",
    borderRadius: "4px",
    ...(variant === "elevation" && {
      boxShadow: getElevationShadow(elevation),
    }),
    ...(variant === "outlined" && {
      border: "1px solid #e0e0e0",
    }),
    ...style,
  }

  return (
    <Component className={className} style={paperStyles}>
      {children}
    </Component>
  )
}
