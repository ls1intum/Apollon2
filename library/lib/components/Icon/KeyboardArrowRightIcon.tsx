import { SVGAttributes } from "react"

type Props = SVGAttributes<SVGSVGElement>

export const KeyboardArrowRightIcon = (props: Props) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
  </svg>
)
