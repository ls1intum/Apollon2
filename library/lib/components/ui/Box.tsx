import { HTMLAttributes, forwardRef, ElementType } from "react"
import "./Box.css"

export interface BoxProps extends HTMLAttributes<HTMLDivElement> {
  component?: ElementType
  sx?: Record<string, string | number>
}

export const Box = forwardRef<HTMLDivElement, BoxProps>(
  (
    { className = "", component = "div", sx = {}, style, children, ...props },
    ref
  ) => {
    const Component = component as ElementType

    // Convert sx prop to inline styles (basic implementation)
    const sxStyles = Object.entries(sx).reduce(
      (acc, [key, value]) => {
        // Convert camelCase to kebab-case for CSS properties
        const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase()
        acc[cssKey] = value
        return acc
      },
      {} as Record<string, string | number>
    )

    const combinedStyles = {
      ...sxStyles,
      ...style,
    }

    return (
      <Component
        ref={ref}
        className={`box ${className}`.trim()}
        style={combinedStyles}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

Box.displayName = "Box"
