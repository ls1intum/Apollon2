import React from "react"

interface TypographyProps {
  children?: React.ReactNode
  variant?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "body1"
    | "body2"
    | "caption"
    | "subtitle1"
    | "subtitle2"
  color?:
    | "primary"
    | "secondary"
    | "error"
    | "warning"
    | "info"
    | "success"
    | "inherit"
  className?: string
  style?: React.CSSProperties
  component?: React.ElementType
}

export const Typography: React.FC<TypographyProps> = ({
  children,
  variant = "body1",
  color = "inherit",
  className = "",
  style = {},
  component,
}) => {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case "h1":
        return { fontSize: "2.5rem", fontWeight: "bold", margin: "0.67em 0" }
      case "h2":
        return { fontSize: "2rem", fontWeight: "bold", margin: "0.75em 0" }
      case "h3":
        return { fontSize: "1.75rem", fontWeight: "bold", margin: "0.83em 0" }
      case "h4":
        return { fontSize: "1.5rem", fontWeight: "bold", margin: "1em 0" }
      case "h5":
        return { fontSize: "1.25rem", fontWeight: "bold", margin: "1.17em 0" }
      case "h6":
        return { fontSize: "1rem", fontWeight: "bold", margin: "1.33em 0" }
      case "subtitle1":
        return { fontSize: "1rem", fontWeight: "500" }
      case "subtitle2":
        return { fontSize: "0.875rem", fontWeight: "500" }
      case "body1":
        return { fontSize: "1rem", fontWeight: "normal" }
      case "body2":
        return { fontSize: "0.875rem", fontWeight: "normal" }
      case "caption":
        return { fontSize: "0.75rem", fontWeight: "normal" }
      default:
        return {}
    }
  }

  const getColorStyles = (): React.CSSProperties => {
    const colors = {
      primary: "#1976d2",
      secondary: "#dc004e",
      error: "#d32f2f",
      warning: "#ed6c02",
      info: "#0288d1",
      success: "#2e7d32",
      inherit: "inherit",
    }
    return { color: colors[color] }
  }

  const getDefaultComponent = (): React.ElementType => {
    if (component) return component
    if (variant.startsWith("h")) return variant as React.ElementType
    return "p"
  }

  const Component = getDefaultComponent()
  const combinedStyles = {
    ...getVariantStyles(),
    ...getColorStyles(),
    ...style,
  }

  return (
    <Component className={className} style={combinedStyles}>
      {children}
    </Component>
  )
}
