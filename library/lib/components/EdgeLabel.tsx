import { IPoint } from "@/edges"
import { EdgeLabelRenderer } from "@xyflow/react"

interface EdgeLabelProps {
  pathMiddlePosition: IPoint
  label?: string | null
  isMiddlePathHorizontal: boolean
  // Add these new props for use case straight paths
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

  // Calculate rotation and positioning
  let rotation = 0
  let offsetX = isMiddlePathHorizontal ? 0 : 10
  let offsetY = isMiddlePathHorizontal ? -20 : 0
  let transform = ""

  if (isUseCasePath && sourcePoint && targetPoint) {
    // Calculate angle between source and target for use case straight paths
    const dx = targetPoint.x - sourcePoint.x
    const dy = targetPoint.y - sourcePoint.y
    const angle = Math.atan2(dy, dx) * (180 / Math.PI)
    
    // Normalize angle to keep text readable (never upside down)
    if (angle > 90 || angle < -90) {
      rotation = angle + 180
    } else {
      rotation = angle
    }
    
    // Calculate perpendicular offset to position label below the edge
    const offsetDistance = 20 // Increased distance from the edge
    
    // Get perpendicular direction (rotate the edge vector by 90 degrees clockwise)
    const perpX = dy // Perpendicular X is original Y
    const perpY = -dx // Perpendicular Y is negative original X
    
    // Normalize the perpendicular vector
    const perpLength = Math.sqrt(perpX * perpX + perpY * perpY)
    const normalizedPerpX = perpX / perpLength
    const normalizedPerpY = perpY / perpLength
    
    // Apply offset in perpendicular direction
    offsetX = normalizedPerpX * offsetDistance
    offsetY = normalizedPerpY * offsetDistance
    
    transform = `translate(${pathMiddlePosition.x + offsetX}px, ${pathMiddlePosition.y + offsetY}px) translate(-50%, 0%) rotate(${rotation}deg)`
  } else {
    // Use existing logic for step paths
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