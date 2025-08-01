import { HTMLAttributes, forwardRef } from "react"
import "./Paper.css"

export interface PaperProps extends HTMLAttributes<HTMLDivElement> {
  elevation?: number
  variant?: "elevation" | "outlined"
  square?: boolean
}

export const Paper = forwardRef<HTMLDivElement, PaperProps>(
  (
    {
      className = "",
      elevation = 1,
      variant = "elevation",
      square = false,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const classes = [
      "paper",
      `paper-${variant}`,
      variant === "elevation" ? `paper-elevation-${elevation}` : "",
      square ? "paper-square" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ")

    return (
      <div ref={ref} className={classes} style={style} {...props}>
        {children}
      </div>
    )
  }
)

Paper.displayName = "Paper"
