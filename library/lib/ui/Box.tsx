import React from "react"

interface BoxProps {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
  sx?: React.CSSProperties // For MUI-like sx prop compatibility
  component?: React.ElementType
  onClick?: () => void
}

export const Box: React.FC<BoxProps> = ({
  children,
  className = "",
  style = {},
  sx = {},
  component: Component = "div",
  onClick,
}) => {
  // Convert sx prop to inline styles (basic implementation)
  const sxStyles = typeof sx === "object" ? sx : {}
  const combinedStyles = { ...style, ...sxStyles }

  return (
    <Component className={className} style={combinedStyles} onClick={onClick}>
      {children}
    </Component>
  )
}
