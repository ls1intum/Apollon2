import { EdgeLabel } from "@/components/EdgeLabel"
import { IPoint } from "../Connection"

interface EdgeMiddleLabelsProps {
  // Basic edge label
  label?: string | null
  pathMiddlePosition: IPoint
  isMiddlePathHorizontal: boolean

  sourcePoint?: IPoint
  targetPoint?: IPoint
  isUseCasePath?: boolean

  // Relationship labels (use case include/extend)
  showRelationshipLabels?: boolean
  relationshipType?: "include" | "extend"
}

export const EdgeMiddleLabels = ({
  label,
  pathMiddlePosition,
  isMiddlePathHorizontal,
  sourcePoint,
  targetPoint,
  isUseCasePath = false,
  showRelationshipLabels = false,
  relationshipType,
}: EdgeMiddleLabelsProps) => {
  return (
    <>
      {/* Standard edge label (center of path) */}
      {label && pathMiddlePosition.x !== 0 && pathMiddlePosition.y !== 0 && (
        <EdgeLabel
          isMiddlePathHorizontal={isMiddlePathHorizontal}
          pathMiddlePosition={pathMiddlePosition}
          label={label}
          sourcePoint={sourcePoint}
          targetPoint={targetPoint}
          isUseCasePath={isUseCasePath}
        />
      )}

      {/* Relationship labels for use case include/extend */}
      {showRelationshipLabels &&
        relationshipType &&
        sourcePoint &&
        targetPoint &&
        (() => {
          // Calculate angle and position for the rotated label
          const dx = targetPoint.x - sourcePoint.x
          const dy = targetPoint.y - sourcePoint.y
          const angle = Math.atan2(dy, dx) * (180 / Math.PI)

          // Normalize angle to keep text readable (never upside down)
          let rotation = angle
          if (angle > 90 || angle < -90) {
            rotation = angle + 180
          }

          // Calculate middle position
          const middleX = (sourcePoint.x + targetPoint.x) / 2
          const middleY = (sourcePoint.y + targetPoint.y) / 2

          return (
            <text
              x={middleX}
              y={middleY}
              textAnchor="middle"
              dominantBaseline="middle"
              transform={`rotate(${rotation}, ${middleX}, ${middleY})`}
              className="edge-label"
              style={{
                fontSize: "12px",
                fill: "black",
                fontStyle: "italic",
                userSelect: "none",
                fontWeight: "bold",
                pointerEvents: "none",
              }}
            >
              {relationshipType === "include" ? "<<include>>" : "<<extend>>"}
            </text>
          )
        })()}
    </>
  )
}
