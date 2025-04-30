import { ClassNodeElement } from "@/types"
import { CustomText } from "./CustomText"
import { FC } from "react"

interface Props {
  items: ClassNodeElement[]
  padding: number
  itemHeight: number
  width: number
  font: string
  offsetFromTop: number
}

export const RowBlockSection: FC<Props> = ({
  items,
  padding,
  itemHeight,
  font,
  offsetFromTop,
}) => (
  <g transform={`translate(0, ${offsetFromTop})`}>
    {items.map((item, index) => (
      <CustomText
        key={item.id}
        x={padding}
        y={15 + index * itemHeight}
        dominantBaseline="middle"
        textAnchor="start"
        font={font}
      >
        {item.name}
      </CustomText>
    ))}
  </g>
)
