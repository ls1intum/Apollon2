import { FC } from "react"

type Props = {
  children: React.ReactNode
  fill?: string
  x?: string | number
  y?: string | number
  dominantBaseline?: string
  textAnchor?: string
  fontWeight?: string
  pointerEvents?: string
  noX?: boolean
  noY?: boolean
}

export const CustomText: FC<Props & Record<string, unknown>> = ({
  children,
  fill,
  x = "50%",
  y = "50%",
  dominantBaseline = "middle",
  textAnchor = "middle",
  fontWeight = "400",
  pointerEvents = "none",
  noX = false,
  noY = false,
  ...props
}: Props) => {
  const pos: { x?: string | number; y?: string | number } = {}
  if (!noX) {
    pos.x = x
  }
  if (!noY) {
    pos.y = y
  }
  return (
    <text
      {...pos}
      style={fill ? { fill } : {}}
      dominantBaseline={dominantBaseline}
      textAnchor={textAnchor}
      fontWeight={fontWeight}
      pointerEvents={pointerEvents}
      {...props}
    >
      {children}
    </text>
  )
}
