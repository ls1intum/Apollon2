import { ZINDEX_LABEL } from "@/constants/zindexConstants"
import { IPoint } from "../Connection"
import { EdgeLabelRenderer } from "@xyflow/react"

interface EdgeMultipleLabelsProps {
  labels: string[]
  pathMiddlePosition: IPoint
  isMiddlePathHorizontal: boolean
  sourcePoint?: IPoint
  targetPoint?: IPoint
  showRelationshipLabels?: boolean
}

export const EdgeMultipleLabels = ({
  labels,
  pathMiddlePosition,
  isMiddlePathHorizontal,
  sourcePoint,
  targetPoint,
  showRelationshipLabels = false,
}: EdgeMultipleLabelsProps) => {
  if (!labels || labels.length === 0 || !showRelationshipLabels) return null

  let arrowRotation = 0

  if (sourcePoint && targetPoint) {
    const dx = targetPoint.x - sourcePoint.x
    const dy = targetPoint.y - sourcePoint.y

    if (isMiddlePathHorizontal) {
      // Middle line is horizontal, so arrow should be horizontal (left or right)
      arrowRotation = dx > 0 ? 0 : 180 // Right if target is to the right, Left if target is to the left
    } else {
      // Middle line is vertical, so arrow should be vertical (up or down)
      arrowRotation = dy > 0 ? 90 : -90 // Down if target is below, Up if target is above
    }
  } else {
    // Fallback to using isMiddlePathHorizontal
    arrowRotation = isMiddlePathHorizontal ? 0 : 90
  }

  // Increase offset to provide more space from the edge and prevent collision
  // Apply offset in both directions to ensure arrow doesn't collide with edge
  const offsetX = isMiddlePathHorizontal ? 35 : 35 // Always apply horizontal offset
  const baseOffsetY = isMiddlePathHorizontal ? 55 : 45 // Increased vertical offset for horizontal edges

  const transform = `translate(${pathMiddlePosition.x + offsetX}px, ${pathMiddlePosition.y + baseOffsetY}px) translate(-50%, -50%)`

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
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          gap: "6px",
        }}
        className="nodrag nopan"
      >
        {/* Left box for arrow icon */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minWidth: "20px",
          }}
        >
          {/* Show arrow icon only for the first label */}
          {labels.length > 0 && (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                color: "black",
                transform: `rotate(${arrowRotation}deg)`,
                transformOrigin: "center",
                minWidth: "20px",
              }}
            >
              <path d="M2 12h20" />
              <path d="m17 5 5 7-5 7" />
            </svg>
          )}
        </div>

        {/* Right box for labels */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "4px",
          }}
        >
          {labels.map((label, index) => (
            <div
              key={index}
              style={{
                fontSize: "10px",
                color: "black",
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    </EdgeLabelRenderer>
  )
}
