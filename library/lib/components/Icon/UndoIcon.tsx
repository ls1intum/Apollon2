import { SVGAttributes } from "react"

export const UndoIcon = ({
  x = 0,
  y = 0,
  width = 16,
  height = 16,
  ...props
}: SVGAttributes<SVGSVGElement>) => (
  <svg
    x={x}
    y={y}
    width={width}
    height={height}
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    {...props}
  >
    <path d="M6,3.6V0L0,6l6,6V8c6-.27,7.53,3.76,7.88,5.77a.27.27,0,0,0,.53,0C17.08,2.86,6,3.6,6,3.6Z" />
  </svg>
)
