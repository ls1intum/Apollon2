import React from "react"

interface TextFieldProps {
  value?: string
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
  onBlur?: (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
  onFocus?: (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
  placeholder?: string
  disabled?: boolean
  required?: boolean
  label?: string
  variant?: "outlined" | "filled" | "standard"
  size?: "small" | "medium"
  className?: string
  style?: React.CSSProperties
  type?: "text" | "password" | "email" | "number"
  multiline?: boolean
  rows?: number
  fullWidth?: boolean
}

export const TextField: React.FC<TextFieldProps> = ({
  value,
  onChange,
  onBlur,
  onFocus,
  placeholder,
  disabled = false,
  required = false,
  label,
  variant = "outlined",
  size = "medium",
  className = "",
  style = {},
  type = "text",
  multiline = false,
  rows = 4,
  fullWidth = false,
}) => {
  const containerStyles: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    width: fullWidth ? "100%" : "auto",
    ...style,
  }

  const inputStyles: React.CSSProperties = {
    padding: size === "small" ? "8px 12px" : "12px 16px",
    fontSize: size === "small" ? "14px" : "16px",
    border: variant === "outlined" ? "1px solid #ccc" : "none",
    borderBottom: variant === "standard" ? "1px solid #ccc" : undefined,
    backgroundColor: variant === "filled" ? "#f5f5f5" : "white",
    borderRadius: variant === "outlined" ? "4px" : "0",
    outline: "none",
    transition: "border-color 0.2s ease",
    fontFamily: "inherit",
    opacity: disabled ? 0.6 : 1,
    cursor: disabled ? "not-allowed" : "text",
    resize: multiline ? "vertical" : "none",
    width: "100%",
    boxSizing: "border-box",
  }

  const labelStyles: React.CSSProperties = {
    fontSize: "14px",
    fontWeight: "500",
    color: "#333",
    marginBottom: "4px",
  }

  const handleFocus = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    e.target.style.borderColor = "#1976d2"
    onFocus?.(e)
  }

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    e.target.style.borderColor = "#ccc"
    onBlur?.(e)
  }

  return (
    <div className={className} style={containerStyles}>
      {label && (
        <label style={labelStyles}>
          {label}
          {required && <span style={{ color: "red" }}>*</span>}
        </label>
      )}
      {multiline ? (
        <textarea
          value={value}
          onChange={onChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          rows={rows}
          style={inputStyles}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          style={inputStyles}
        />
      )}
    </div>
  )
}
