import { SVGAttributes } from "react"

type Props = SVGAttributes<SVGSVGElement>

export const SouthEastIcon = (props: Props) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M19 9h-2v6.59L5.41 4 4 5.41 15.59 17H9v2h10V9z" />
  </svg>
)
