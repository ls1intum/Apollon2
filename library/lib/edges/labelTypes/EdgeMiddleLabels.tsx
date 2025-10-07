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
  isPetriNet?: boolean // New prop to identify PetriNet edges
  textColor: string
}

export const EdgeMiddleLabels = ({
  label,
  pathMiddlePosition,
  isMiddlePathHorizontal,
  sourcePoint,
  targetPoint,
  showRelationshipLabels = false,
  isUseCasePath = false,
  isPetriNet = false,
  textColor,
}: EdgeMiddleLabelsProps) => {
  if (isPetriNet && label === "1") return null

  if (!label || !showRelationshipLabels) return null

  let transform = ""
  let offsetX = 0
  let offsetY = 0
  let labelX = pathMiddlePosition.x
  let labelY = pathMiddlePosition.y
  let rotation: number | null = null

  if (isUseCasePath && sourcePoint && targetPoint) {
    const dx = targetPoint.x - sourcePoint.x
    const dy = targetPoint.y - sourcePoint.y
    const angle = Math.atan2(dy, dx) * (180 / Math.PI)
    let computedRotation = angle
    if (angle > 90 || angle < -90) {
      computedRotation = angle + 180
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

    labelX = (sourcePoint.x + targetPoint.x) / 2 + offsetX
    labelY = (sourcePoint.y + targetPoint.y) / 2 + offsetY
    rotation = computedRotation
    transform = `translate(${labelX}px, ${labelY}px) translate(-50%, -50%) rotate(${computedRotation}deg)`
  } else {
    offsetX = isMiddlePathHorizontal ? 0 : 10
    offsetY = isMiddlePathHorizontal ? +20 : 0
    labelX = pathMiddlePosition.x + offsetX
    labelY = pathMiddlePosition.y + offsetY
    transform = `translate(${labelX}px, ${labelY}px) translate(-50%, -50%)`
  }

  return (
    <EdgeLabelRenderer>
      <div
        data-export-label-type="association"
        data-export-x={labelX}
        data-export-y={labelY}
        data-export-rotation={rotation ?? undefined}
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
          color: textColor,
        }}
        className="nodrag nopan"
      >
        {label}
      </div>
    </EdgeLabelRenderer>
  )
}
