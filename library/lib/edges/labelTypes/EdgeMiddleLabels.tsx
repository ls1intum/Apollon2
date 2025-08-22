import { ZINDEX_LABEL } from "@/constants/zindexConstants"
import { IPoint } from "../Connection"
import { EdgeLabelRenderer } from "@xyflow/react"

interface EdgeMiddleLabelsProps {
  label?: string | null
  pathMiddlePosition: IPoint
  isMiddlePathHorizontal: boolean
  sourcePoint?: IPoint
  targetPoint?: IPoint
  showRelationshipLabels?: boolean
  isUseCasePath?: boolean
}

export const EdgeMiddleLabels = ({
  label,
  pathMiddlePosition,
  isMiddlePathHorizontal,
  sourcePoint,
  targetPoint,
  showRelationshipLabels = false,
  isUseCasePath = false,
}: EdgeMiddleLabelsProps) => {
  if (!label || !showRelationshipLabels) return null

  let transform = ""
  let offsetX = 0
  let offsetY = 0

  if (isUseCasePath && sourcePoint && targetPoint) {
    const dx = targetPoint.x - sourcePoint.x
    const dy = targetPoint.y - sourcePoint.y
    const angle = Math.atan2(dy, dx) * (180 / Math.PI)
    let rotation = angle
    if (angle > 90 || angle < -90) {
      rotation = angle + 180
    }

    const offsetDistance = 15
    const perpX = -dy
    const perpY = dx
    const perpLength = Math.sqrt(perpX * perpX + perpY * perpY)

    if (perpLength > 0) {
      const normalizedPerpX = perpX / perpLength
      const normalizedPerpY = perpY / perpLength
      offsetX = normalizedPerpX * offsetDistance
      offsetY = normalizedPerpY * offsetDistance
    }

    const middleX = (sourcePoint.x + targetPoint.x) / 2 + offsetX
    const middleY = (sourcePoint.y + targetPoint.y) / 2 + offsetY

    transform = `translate(${middleX}px, ${middleY}px) translate(-50%, -50%) rotate(${rotation}deg)`
  } else {
    offsetX = isMiddlePathHorizontal ? 0 : 10
    offsetY = isMiddlePathHorizontal ? +20 : 0

    transform = `translate(${pathMiddlePosition.x + offsetX}px, ${pathMiddlePosition.y + offsetY}px) translate(-50%, -50%)`
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
          pointerEvents: "none",
          zIndex: ZINDEX_LABEL,
        }}
        className="nodrag nopan"
      >
        {label}
      </div>
    </EdgeLabelRenderer>
  )
}
