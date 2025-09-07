import { FC } from "react"
import { ClassType } from "@/types"
import { CustomText } from "./CustomText"

interface HeaderSectionProps {
  showStereotype: boolean
  stereotype?: ClassType
  name: string
  width: number
  headerHeight: number
  isUnderlined?: boolean
  textColor?: string
  fill?: string
}

export const HeaderSection: FC<HeaderSectionProps> = ({
  showStereotype,
  stereotype,
  name,
  width,
  headerHeight,
  isUnderlined = false,
  textColor,
  fill = "var(--apollon2-background)",
}) => {
  return (
    <>
      <rect
        x={0.5}
        y={0.5}
        width={width - 1}
        height={headerHeight - 0.5}
        fill={fill}
      />
      <CustomText
        x={width / 2}
        y={headerHeight / 2}
        dominantBaseline="middle"
        textAnchor="middle"
        fontWeight="bold"
        textDecoration={isUnderlined ? "underline" : "normal"}
        fill={textColor}
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
    </>
  )
}
