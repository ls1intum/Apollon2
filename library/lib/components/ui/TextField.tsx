import { InputHTMLAttributes, forwardRef } from "react"
import "./TextField.css"

export interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string
  variant?: "outlined" | "filled" | "standard"
  size?: "small" | "medium"
  fullWidth?: boolean
  error?: boolean
  helperText?: string
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      className = "",
      label,
      variant = "outlined",
      size = "medium",
      fullWidth = false,
      error = false,
      helperText,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `textfield-${Math.random().toString(36).substr(2, 9)}`
    const containerClasses = [
      "textfield-container",
      `textfield-${variant}`,
      `textfield-${size}`,
      fullWidth ? "textfield-full-width" : "",
      error ? "textfield-error" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ")

    return (
      <div className={containerClasses}>
        {label && (
          <label htmlFor={inputId} className="textfield-label">
            {label}
          </label>
        )}
        <input ref={ref} id={inputId} className="textfield-input" {...props} />
        {helperText && (
          <div className="textfield-helper-text">{helperText}</div>
        )}
      </div>
    )
  }
)

TextField.displayName = "TextField"
