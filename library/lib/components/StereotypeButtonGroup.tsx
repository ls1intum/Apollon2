import React from "react"
import { Button, ButtonGroup } from "@mui/material"
import { ClassType } from "@/types"

interface StereotypeButtonGroupProps {
  selected: ClassType | undefined
  onChange: (newStereotype: ClassType | undefined) => void
}

export const StereotypeButtonGroup: React.FC<StereotypeButtonGroupProps> = ({
  selected,
  onChange,
}) => {
  const stereotypes: ClassType[] = [
    ClassType.Abstract,
    ClassType.Interface,
    ClassType.Enumeration,
  ]

  const handleButtonClick = (stereotype: ClassType) => {
    onChange(selected === stereotype ? undefined : stereotype)
  }

  return (
    <ButtonGroup aria-label="Stereotype selection" size="small">
      {stereotypes.map((stereotype) => (
        <Button
          key={stereotype}
          variant={selected === stereotype ? "contained" : "outlined"}
          onClick={() => handleButtonClick(stereotype)}
        >
          {stereotype}
        </Button>
      ))}
    </ButtonGroup>
  )
}
