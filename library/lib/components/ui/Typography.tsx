import { HTMLAttributes, forwardRef, ElementType } from "react"
import "./Typography.css"

export interface TypographyProps extends HTMLAttributes<HTMLElement> {
  variant?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "subtitle1"
    | "subtitle2"
    | "body1"
    | "body2"
    | "caption"
    | "overline"
  component?: ElementType
  gutterBottom?: boolean
  noWrap?: boolean
  align?: "left" | "center" | "right" | "justify"
  htmlFor?: string
}

export const Typography = forwardRef<HTMLElement, TypographyProps>(
  (
    {
      className = "",
      variant = "body1",
      component,
      gutterBottom = false,
      noWrap = false,
      align,
      htmlFor,
      children,
      style,
      ...props
    },
    ref
  ) => {
    // Default component based on variant
    const defaultComponent = (() => {
      switch (variant) {
        case "h1":
          return "h1"
        case "h2":
          return "h2"
        case "h3":
          return "h3"
        case "h4":
          return "h4"
        case "h5":
          return "h5"
        case "h6":
          return "h6"
        case "subtitle1":
        case "subtitle2":
        case "body1":
        case "body2":
        default:
          return "p"
        case "caption":
        case "overline":
          return "span"
      }
    })()

    const Component = (component || defaultComponent) as ElementType

    const classes = [
      "typography",
      `typography-${variant}`,
      gutterBottom ? "typography-gutter-bottom" : "",
      noWrap ? "typography-no-wrap" : "",
      align ? `typography-align-${align}` : "",
      className,
    ]
      .filter(Boolean)
      .join(" ")

    return (
      <Component
        ref={ref}
        className={classes}
        style={style}
        htmlFor={component === "label" ? htmlFor : undefined}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

Typography.displayName = "Typography"
