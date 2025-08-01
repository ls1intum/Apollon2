import React from "react"

export interface ModalProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  children,
  className = "",
  style,
}) => {
  if (!open) {
    return null
  }

  return (
    <div
      className={`modal-backdrop ${className}`}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1300,
        ...style,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      {children}
    </div>
  )
}
