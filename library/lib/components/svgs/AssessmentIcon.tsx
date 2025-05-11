import React from "react"
import { CheckIcon, ExclamationIcon, Cross } from "../Icon"

interface AssessmentIconProps {
  score?: number
  x: number
  y: number
}

const AssessmentIcon: React.FC<AssessmentIconProps> = ({ score, x, y }) => {
  if (score === undefined) {
    return null
  }
  const RADIUS = 15
  const ICON_SIZE = 20
  const centerX = x + RADIUS
  const centerY = y + RADIUS

  const iconProps = {
    width: ICON_SIZE,
    height: ICON_SIZE,
    x: centerX - ICON_SIZE / 2,
    y: centerY - ICON_SIZE / 2,
  }

  if (score > 0) {
    return (
      <g>
        <circle
          cx={centerX}
          cy={centerY}
          r={RADIUS}
          fill="#f0f0f0"
          stroke="#ccc"
          opacity={0.7}
        />
        <CheckIcon {...iconProps} fill="green" />
      </g>
    )
  } else if (score < 0) {
    return (
      <g>
        <circle
          cx={centerX}
          cy={centerY}
          r={RADIUS}
          fill="#f0f0f0"
          stroke="#ccc"
          opacity={0.7}
        />
        <Cross {...iconProps} fill="red" />
      </g>
    )
  } else if (score === 0) {
    return (
      <g>
        <circle
          cx={centerX}
          cy={centerY}
          r={RADIUS}
          fill="#f0f0f0"
          stroke="#ccc"
          opacity={0.7}
        />
        <ExclamationIcon {...iconProps} fill="blue" />
      </g>
    )
  }

  return null
}

export default AssessmentIcon
