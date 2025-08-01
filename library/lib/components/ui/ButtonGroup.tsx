import { HTMLAttributes, ReactNode } from "react"
import "./ButtonGroup.css"

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "contained" | "outlined" | "text"
  color?: "primary" | "secondary" | "inherit"
  size?: "small" | "medium" | "large"
  orientation?: "horizontal" | "vertical"
  children: ReactNode
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  className = "",
  variant = "outlined",
  color = "primary",
  size = "medium",
  orientation = "horizontal",
  children,
  ...props
}) => {
  const classes = [
    "button-group",
    `button-group-${variant}`,
    `button-group-${color}`,
    `button-group-${size}`,
    `button-group-${orientation}`,
    className,
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <div className={classes} role="group" {...props}>
      {children}
    </div>
  )
}
