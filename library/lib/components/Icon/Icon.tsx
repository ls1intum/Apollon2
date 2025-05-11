import { SVGAttributes } from "react"

export const Icon = ({
  children,
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
    viewBox="0 0 512 512"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    {...props}
  >
    {children}
  </svg>
)
