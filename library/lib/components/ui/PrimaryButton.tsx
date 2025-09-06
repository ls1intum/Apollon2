interface Props {
  children: React.ReactNode
  isSelected: boolean
  onClick: () => void
  style?: React.CSSProperties
}

const buttonBaseStyle: React.CSSProperties = {
  padding: "4px 8px",
  fontWeight: 500,
  fontSize: "0.875rem",
  border: "1px solid var(--apollon2-primary)",
  backgroundColor: "var(--apollon2-background)",
  color: "var(--apollon2-primary)",
  cursor: "pointer",
}

export const PrimaryButton: React.FC<Props> = ({
  children,
  isSelected,
  onClick,
  style,
}) => {
  const buttonStyle: React.CSSProperties = {
    ...buttonBaseStyle,
    backgroundColor: isSelected
      ? "var(--apollon2-primary)"
      : "var(--apollon2-background)",
    color: isSelected
      ? "var(--apollon2-background)"
      : "var(--apollon2-primary)",
    ...style,
  }

  return (
    <button style={buttonStyle} onClick={onClick}>
      {children}
    </button>
  )
}
