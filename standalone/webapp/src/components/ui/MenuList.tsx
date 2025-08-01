import React from "react"

export interface MenuListProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  dense?: boolean
}

export const MenuList: React.FC<MenuListProps> = ({
  children,
  className = "",
  style,
  dense = false,
}) => {
  return (
    <ul
      className={`menu-list ${className}`}
      style={{
        margin: 0,
        padding: dense ? "4px 0" : "8px 0",
        listStyle: "none",
        ...style,
      }}
    >
      {children}
    </ul>
  )
}
