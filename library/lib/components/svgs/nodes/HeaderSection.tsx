import { FC } from "react"
import { ClassType } from "@/types"
import { CustomText } from "./CustomText"

interface HeaderSectionProps {
  showStereotype: boolean
  stereotype?: ClassType
  name: string
  width: number
  font: string
  headerHeight: number
}

export const HeaderSection: FC<HeaderSectionProps> = ({
  showStereotype,
  stereotype,
  name,
  width,
  font,
  headerHeight,
}) => {
  return (
    <CustomText
      x={width / 2}
      y={headerHeight / 2}
      dominantBaseline="middle"
      textAnchor="middle"
      font={font}
      fontWeight="bold"
      textDecoration={
        stereotype === ClassType.ObjectClass ? "underline" : "normal"
      }
    >
      {showStereotype && (
        <tspan x={width / 2} dy="-8" fontSize="85%">
          {`«${stereotype}»`}
        </tspan>
      )}
      <tspan
        x={width / 2}
        dy={showStereotype ? "18" : "0"}
        fontStyle={stereotype === ClassType.Abstract ? "italic" : "normal"}
      >
        {name}
      </tspan>
    </CustomText>
  )
}
