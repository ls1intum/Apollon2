import { IPoint } from "@/edges"
import { EdgeLabelRenderer } from "@xyflow/react"

interface EdgeLabelProps {
  pathMiddlePosition: IPoint
  label?: string | null
  isMiddlePathHorizontal: boolean
}

export const EdgeLabel = ({
  pathMiddlePosition,
  label = "",
  isMiddlePathHorizontal,
}: EdgeLabelProps) => {
  if (!label) return null

  const OffsetX = isMiddlePathHorizontal ? 0 : 10
  const OffsetY = isMiddlePathHorizontal ? -20 : 0

  const labelTransform = `${isMiddlePathHorizontal ? " translate(-50% , 0% )" : ""} translate(
          ${pathMiddlePosition.x + OffsetX}px,
          ${pathMiddlePosition.y + OffsetY}px)`

  return (
    <EdgeLabelRenderer>
      <div
        style={{
          position: "absolute",
          transform: labelTransform,
          borderRadius: 5,
          fontSize: 12,
          fontWeight: 700,
        }}
        className="nodrag nopan"
      >
        {label}
      </div>
    </EdgeLabelRenderer>
  )
}
