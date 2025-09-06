import React from "react"
import { TextField as MUITextField, TextFieldProps } from "@mui/material"

export const TextField: React.FC<TextFieldProps> = ({ sx, ...props }) => {
  return (
    <MUITextField
      sx={{
        ...sx,
        bgcolor: "var(--apollon2-background)",
        input: {
          color: "var(--apollon2-primary-contrast)",
          border: "none",
        },
      }}
      {...props}
    />
  )
}
