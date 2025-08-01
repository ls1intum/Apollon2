import { ReactNode, HTMLAttributes } from "react"
import "./Tooltip.css"

export interface TooltipProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title: ReactNode
  children: ReactNode
  placement?: "top" | "bottom" | "left" | "right"
  arrow?: boolean
}

export const Tooltip: React.FC<TooltipProps> = ({
  title,
  children,
  placement = "top",
  arrow = false,
  className = "",
  ...props
}) => {
  return (
    <div className={`tooltip-container ${className}`} {...props}>
      {children}
      <div
        className={`tooltip-content tooltip-${placement} ${arrow ? "tooltip-arrow" : ""}`}
      >
        {title}
      </div>
    </div>
  )
}
