import { StraightPathEdge, StraightPathEdgeData } from "../pathTypes/StraightPathEdge"
import { EdgeMiddleLabels } from "../labelTypes/EdgeMiddleLabels"
import { BaseEdgeProps } from "../GenericEdge"
import { 
  adjustTargetCoordinates, 
  adjustSourceCoordinates, 
  getEdgeMarkerStyles 
} from "@/utils/edgeUtils"
import { 
  MARKER_PADDING, 
  SOURCE_CONNECTION_POINT_PADDING 
} from "@/constants"
import { useMemo } from "react"

interface UseCaseEdgeProps extends BaseEdgeProps {
  showRelationshipLabels?: boolean
}

export const UseCaseEdge = ({
  id,
  type,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  sourceHandleId,
  targetHandleId,
  data,
  showRelationshipLabels = false,
}: UseCaseEdgeProps) => {
  
  // Calculate adjusted coordinates once at the top level
  const adjustedCoordinates = useMemo(() => {
    const { markerPadding } = getEdgeMarkerStyles(type)
    const padding = markerPadding ?? MARKER_PADDING
    
    const adjustedTarget = adjustTargetCoordinates(
      targetX,
      targetY,
      targetPosition || 'right',
      padding
    )
    const adjustedSource = adjustSourceCoordinates(
      sourceX,
      sourceY,
      sourcePosition || 'left',
      SOURCE_CONNECTION_POINT_PADDING
    )
    
    console.log(`=== UseCaseEdge ${id} Coordinate Adjustments ===`)
    console.log('Original:', { sourceX, sourceY, targetX, targetY })
    console.log('Adjusted source:', adjustedSource)
    console.log('Adjusted target:', adjustedTarget)
    console.log('Padding applied:', { padding, SOURCE_CONNECTION_POINT_PADDING })
    
    return { adjustedSource, adjustedTarget }
  }, [sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, type, id])

  // Calculate the correct middle position for labels based on edge type
  const labelMiddlePosition = useMemo(() => {
    const { adjustedSource, adjustedTarget } = adjustedCoordinates
    
    if (type === "UseCaseInclude") {
      // For UseCaseInclude, the label should be positioned in the gap
      const startX = adjustedSource.sourceX
      const startY = adjustedSource.sourceY  
      const endX = adjustedTarget.targetX
      const endY = adjustedTarget.targetY
      
      // Calculate the true middle of the gap
      const midX = (startX + endX) / 2
      const midY = (startY + endY) / 2
      
      console.log(`UseCaseInclude label position for ${id}:`, { midX, midY })
      return { x: midX, y: midY }
    }
    
    // For other edge types, use simple middle calculation
    return {
      x: (adjustedSource.sourceX + adjustedTarget.targetX) / 2,
      y: (adjustedSource.sourceY + adjustedTarget.targetY) / 2
    }
  }, [adjustedCoordinates, type, id])

  // Determine relationship type for labels
  const relationshipType = type === "UseCaseInclude" ? "include" : 
                          type === "UseCaseExtend" ? "extend" : 
                          undefined

  return (
    <StraightPathEdge
      id={id}
      type={type}
      source={source}
      target={target}
      sourceX={adjustedCoordinates.adjustedSource.sourceX}
      sourceY={adjustedCoordinates.adjustedSource.sourceY}
      targetX={adjustedCoordinates.adjustedTarget.targetX}
      targetY={adjustedCoordinates.adjustedTarget.targetY}
      sourcePosition={sourcePosition}
      targetPosition={targetPosition}
      sourceHandleId={sourceHandleId}
      targetHandleId={targetHandleId}
      data={data}
    >
      {(edgeData: StraightPathEdgeData) => 
        
       
          <EdgeMiddleLabels
            label={data?.label}
            // Use our calculated middle position instead of the one from edgeData
            pathMiddlePosition={labelMiddlePosition}
            isMiddlePathHorizontal={edgeData.isMiddlePathHorizontal}
            // Pass adjusted coordinates for consistency
            sourcePoint={{
              x: adjustedCoordinates.adjustedSource.sourceX, 
              y: adjustedCoordinates.adjustedSource.sourceY
            }}
            targetPoint={{
              x: adjustedCoordinates.adjustedTarget.targetX, 
              y: adjustedCoordinates.adjustedTarget.targetY
            }}
            isUseCasePath={true}
            showRelationshipLabels={showRelationshipLabels}
            relationshipType={relationshipType}
          />
        
      }
    </StraightPathEdge>
  )
}