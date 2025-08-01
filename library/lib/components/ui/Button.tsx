import { ButtonHTMLAttributes, forwardRef } from "react"
import "./Button.css"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "contained" | "outlined" | "text"
  color?: "primary" | "secondary" | "error" | "warning" | "info" | "success"
  size?: "small" | "medium" | "large"
  fullWidth?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "contained",
      color = "primary",
      size = "medium",
      fullWidth = false,
      children,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const baseClasses = [
      "btn",
      `btn-${variant}`,
      `btn-${color}`,
      `btn-${size}`,
      fullWidth ? "btn-full-width" : "",
      disabled ? "btn-disabled" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ")

    return (
      <button ref={ref} className={baseClasses} disabled={disabled} {...props}>
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"
