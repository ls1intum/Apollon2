import {
  ReactNode,
  HTMLAttributes,
  SelectHTMLAttributes,
  forwardRef,
} from "react"
import "./Select.css"

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string
  variant?: "outlined" | "filled" | "standard"
  size?: "small" | "medium"
  fullWidth?: boolean
  error?: boolean
  children: ReactNode
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className = "",
      label,
      variant = "outlined",
      size = "medium",
      fullWidth = false,
      error = false,
      id,
      children,
      ...props
    },
    ref
  ) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`
    const containerClasses = [
      "select-container",
      `select-${variant}`,
      `select-${size}`,
      fullWidth ? "select-full-width" : "",
      error ? "select-error" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ")

    return (
      <div className={containerClasses}>
        {label && (
          <label htmlFor={selectId} className="select-label">
            {label}
          </label>
        )}
        <select ref={ref} id={selectId} className="select-input" {...props}>
          {children}
        </select>
      </div>
    )
  }
)

export interface MenuItemProps extends HTMLAttributes<HTMLOptionElement> {
  value?: string | number
  children: ReactNode
}

export const MenuItem: React.FC<MenuItemProps> = ({
  value,
  children,
  ...props
}) => (
  <option value={value} {...props}>
    {children}
  </option>
)

Select.displayName = "Select"
