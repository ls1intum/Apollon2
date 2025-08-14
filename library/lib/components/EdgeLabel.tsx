import { IPoint } from "@/edges"
import { EdgeLabelRenderer } from "@xyflow/react"

interface EdgeLabelProps {
  pathMiddlePosition: IPoint
  label?: string | null
  isMiddlePathHorizontal: boolean
  sourcePoint?: IPoint
  targetPoint?: IPoint
  isUseCasePath?: boolean
}

export const EdgeLabel = ({
  pathMiddlePosition,
  label = "",
  isMiddlePathHorizontal,
  sourcePoint,
  targetPoint,
  isUseCasePath = false,
}: EdgeLabelProps) => {
  if (!label) return null

  let rotation = 0
  let offsetX = isMiddlePathHorizontal ? 0 : 10
  let offsetY = isMiddlePathHorizontal ? -20 : 0
  let transform = ""

  if (isUseCasePath && sourcePoint && targetPoint) {
    const dx = targetPoint.x - sourcePoint.x
    const dy = targetPoint.y - sourcePoint.y
    const angle = Math.atan2(dy, dx) * (180 / Math.PI)

    if (angle > 90 || angle < -90) {
      rotation = angle + 180
    } else {
      rotation = angle
    }

    const offsetDistance = 20
    const perpX = dy
    const perpY = -dx
    const perpLength = Math.sqrt(perpX * perpX + perpY * perpY)
    const normalizedPerpX = perpX / perpLength
    const normalizedPerpY = perpY / perpLength
    offsetX = normalizedPerpX * offsetDistance
    offsetY = normalizedPerpY * offsetDistance

    transform = `translate(${pathMiddlePosition.x + offsetX}px, ${pathMiddlePosition.y + offsetY}px) translate(-50%, 0%) rotate(${rotation}deg)`
  } else {
    const translateX = isMiddlePathHorizontal ? " translate(-50%, 0%)" : ""
    transform = `${translateX} translate(${pathMiddlePosition.x + offsetX}px, ${pathMiddlePosition.y + offsetY}px)`
  }

  return (
    <EdgeLabelRenderer>
      <div
        style={{
          position: "absolute",
          transform: transform,
          borderRadius: 5,
          fontSize: 12,
          fontWeight: 700,
          transformOrigin: "center center",
          whiteSpace: "nowrap",
        }}
        className="nodrag nopan"
      >
        {label}
      </div>
    </EdgeLabelRenderer>
  )
}
