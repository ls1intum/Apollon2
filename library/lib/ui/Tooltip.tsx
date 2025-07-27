import React, { useState } from "react"

interface TooltipProps {
  children: React.ReactElement
  title: string
  placement?: "top" | "bottom" | "left" | "right"
  arrow?: boolean
  className?: string
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  title,
  placement = "top",
  arrow = false,
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(false)

  const tooltipStyles: React.CSSProperties = {
    position: "absolute",
    backgroundColor: "#333",
    color: "white",
    padding: "8px 12px",
    borderRadius: "4px",
    fontSize: "12px",
    whiteSpace: "nowrap",
    zIndex: 1000,
    opacity: isVisible ? 1 : 0,
    visibility: isVisible ? "visible" : "hidden",
    transition: "opacity 0.2s ease, visibility 0.2s ease",
    pointerEvents: "none",
    ...getPlacementStyles(placement),
  }

  function getPlacementStyles(placement: string): React.CSSProperties {
    switch (placement) {
      case "top":
        return {
          bottom: "100%",
          left: "50%",
          transform: "translateX(-50%)",
          marginBottom: "8px",
        }
      case "bottom":
        return {
          top: "100%",
          left: "50%",
          transform: "translateX(-50%)",
          marginTop: "8px",
        }
      case "left":
        return {
          right: "100%",
          top: "50%",
          transform: "translateY(-50%)",
          marginRight: "8px",
        }
      case "right":
        return {
          left: "100%",
          top: "50%",
          transform: "translateY(-50%)",
          marginLeft: "8px",
        }
      default:
        return {}
    }
  }

  return (
    <div
      className={className}
      style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <div style={tooltipStyles}>
        {title}
        {arrow && (
          <div
            style={{
              position: "absolute",
              width: "0",
              height: "0",
              borderStyle: "solid",
              ...getArrowStyles(placement),
            }}
          />
        )}
      </div>
    </div>
  )
}

function getArrowStyles(placement: string): React.CSSProperties {
  switch (placement) {
    case "top":
      return {
        top: "100%",
        left: "50%",
        transform: "translateX(-50%)",
        borderLeft: "5px solid transparent",
        borderRight: "5px solid transparent",
        borderTop: "5px solid #333",
      }
    case "bottom":
      return {
        bottom: "100%",
        left: "50%",
        transform: "translateX(-50%)",
        borderLeft: "5px solid transparent",
        borderRight: "5px solid transparent",
        borderBottom: "5px solid #333",
      }
    case "left":
      return {
        left: "100%",
        top: "50%",
        transform: "translateY(-50%)",
        borderTop: "5px solid transparent",
        borderBottom: "5px solid transparent",
        borderLeft: "5px solid #333",
      }
    case "right":
      return {
        right: "100%",
        top: "50%",
        transform: "translateY(-50%)",
        borderTop: "5px solid transparent",
        borderBottom: "5px solid transparent",
        borderRight: "5px solid #333",
      }
    default:
      return {}
  }
}
