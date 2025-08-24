import { ZINDEX_LABEL } from "@/constants/zindexConstants"
import { IPoint } from "../Connection"
import { EdgeLabelRenderer } from "@xyflow/react"
import { MessageData } from "../EdgeProps"

export const EdgeMultipleLabels: React.FC<{
  labels: string[]
  messages?: MessageData[]
  pathMiddlePosition: IPoint
  isMiddlePathHorizontal: boolean
  showRelationshipLabels: boolean
}> = ({
  labels,
  messages,
  pathMiddlePosition,
  isMiddlePathHorizontal,
  showRelationshipLabels
}) => {
  
  // Use messages if available, otherwise fall back to labels for backward compatibility
  const displayMessages: MessageData[] = messages || labels.map(label => ({
    text: label,
    direction: "forward" as const
  }))

  if (!displayMessages || displayMessages.length === 0 || !showRelationshipLabels) return null

  // Group messages by direction
  const forwardMessages = displayMessages.filter(msg => msg.direction === "forward")
  const backwardMessages = displayMessages.filter(msg => msg.direction === "backward")

  // Direction-based positioning following the old version's logic
  const isHorizontalEdge = isMiddlePathHorizontal
  let sourceArrowDirection: "Up" | "Down" | "Left" | "Right"
  let targetArrowDirection: "Up" | "Down" | "Left" | "Right"
  let forwardArrowRotation = 0
  let backwardArrowRotation = 180
  
  if (isHorizontalEdge) {
    // Horizontal path: arrows point left/right
    sourceArrowDirection = "Right"  // Forward messages (source -> target)
    targetArrowDirection = "Left"   // Backward messages (target -> source)
  } else {
    // Vertical path: arrows point up/down  
    sourceArrowDirection = "Down"   // Forward messages (source -> target)
    targetArrowDirection = "Up"     // Backward messages (target -> source)
  }

  // Calculate positions based on arrow directions (following old version logic)
  const arrowSize = { width: 16, height: 16 } // Approximate arrow size
  
  let forwardArrowBoxPosition: { x: number; y: number }
  let forwardLabelBoxPosition: { x: number; y: number }
  let backwardArrowBoxPosition: { x: number; y: number }
  let backwardLabelBoxPosition: { x: number; y: number }

  // Position calculations based on direction (matching old version's computeBoundingBoxForMessages logic)
  if (sourceArrowDirection === "Right") {
    // Forward: ⟶ messages (horizontal edge, top side)
    forwardArrowBoxPosition = { x: 0, y: -arrowSize.height }
    forwardLabelBoxPosition = { x: 25, y: -arrowSize.height } // 25px offset to the right from arrow
  } else if (sourceArrowDirection === "Down") {
    // Forward: ↓ messages (vertical edge, right side)
    forwardArrowBoxPosition = { x: arrowSize.width, y: 0 }
    forwardLabelBoxPosition = { x: arrowSize.width + 25, y: 0 } // 25px offset to the right from arrow
  } else { // sourceArrowDirection === "Up" (this case doesn't exist in current logic, but keeping for completeness)
    // Forward: ↑ messages (vertical edge, left side)
    forwardArrowBoxPosition = { x: -arrowSize.width, y: 0 }
    forwardLabelBoxPosition = { x: -arrowSize.width - 25, y: 0 } // 25px offset to the left from arrow
  }

  if (targetArrowDirection === "Left") {
    // Backward: ⟵ messages (horizontal edge, bottom side)
    backwardArrowBoxPosition = { x: 0, y: arrowSize.height }
    backwardLabelBoxPosition = { x: 25, y: arrowSize.height } // 25px offset to the right from arrow
  } else if (targetArrowDirection === "Up") {
    // Backward: ↑ messages (vertical edge, left side)
    backwardArrowBoxPosition = { x: -arrowSize.width, y: 0 }
    backwardLabelBoxPosition = { x: -arrowSize.width - 25, y: 0 } // 25px offset to the left from arrow
  } else { // targetArrowDirection === "Down"
    // Backward: ↓ messages (vertical edge, right side)
    backwardArrowBoxPosition = { x: arrowSize.width, y: 0 }
    backwardLabelBoxPosition = { x: arrowSize.width + 25, y: 0 } // 25px offset to the right from arrow
  }

  // Set rotation based on direction
  forwardArrowRotation = sourceArrowDirection === "Right" ? 0 : 
                        sourceArrowDirection === "Down" ? 90 : -90
  
  backwardArrowRotation = targetArrowDirection === "Left" ? 180 :
                         targetArrowDirection === "Up" ? -90 : 90

  return (
    <EdgeLabelRenderer>
      {/* Forward Messages */}
      {forwardMessages.map((message, index) => {
        // Calculate arrow position (only for first message)
        const arrowOffset = {
          x: forwardArrowBoxPosition.x,
          y: forwardArrowBoxPosition.y
        }
        
        // Calculate label position using old version's stacking logic
        let labelOffset: { x: number; y: number }
        
        // Following old version's computeBoundingBoxForMessages logic
        if (sourceArrowDirection === "Right") {
          // ⟶ messages: center message, drawing from top to bottom  
          labelOffset = {
            x: forwardLabelBoxPosition.x,
            y: forwardLabelBoxPosition.y - (index * 16) // Stack upward (negative y)
          }
        } else if (sourceArrowDirection === "Down") {
          // ↓ messages: drawing from left to right, position to the right
          labelOffset = {
            x: forwardLabelBoxPosition.x,
            y: forwardLabelBoxPosition.y + (index * 16) // Stack downward
          }
        } else { // sourceArrowDirection === "Up"
          // ↑ messages: position to the left
          labelOffset = {
            x: forwardLabelBoxPosition.x,
            y: forwardLabelBoxPosition.y + (index * 16) // Stack downward
          }
        }
        
        return (
          <div key={`forward-container-${index}`}>
            {/* Arrow box (only for first message) */}
            {index === 0 && (
              <div
                style={{
                  position: "absolute",
                  transform: `translate(${pathMiddlePosition.x + arrowOffset.x}px, ${pathMiddlePosition.y + arrowOffset.y}px) translate(-50%, -50%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: ZINDEX_LABEL,
                }}
                className="nodrag nopan"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    color: "black",
                    transform: `rotate(${forwardArrowRotation}deg)`,
                    transformOrigin: "center",
                  }}
                >
                  <path d="M2 12h20" />
                  <path d="m17 5 5 7-5 7" />
                </svg>
              </div>
            )}
            
            {/* Label box */}
            <div
              style={{
                position: "absolute",
                transform: sourceArrowDirection === "Right" 
                  ? `translate(${pathMiddlePosition.x + labelOffset.x}px, ${pathMiddlePosition.y + labelOffset.y}px) translate(0%, -50%)` // Left-anchored for horizontal top labels
                  : sourceArrowDirection === "Down"
                  ? `translate(${pathMiddlePosition.x + labelOffset.x}px, ${pathMiddlePosition.y + labelOffset.y}px) translate(0%, -50%)` // Left-anchored for vertical right labels (expand right)
                  : `translate(${pathMiddlePosition.x + labelOffset.x}px, ${pathMiddlePosition.y + labelOffset.y}px) translate(-100%, -50%)`, // Right-anchored for vertical left labels (expand left)
                fontSize: "10px",
                fontWeight: 700,
                color: "black",
                whiteSpace: "nowrap",
                pointerEvents: "none",
                zIndex: ZINDEX_LABEL,
                textAlign: sourceArrowDirection === "Right" ? "left" : undefined, // Left-align for horizontal edge (top) labels
              }}
              className="nodrag nopan"
            >
              {message.text}
            </div>
          </div>
        )
      })}

      {/* Backward Messages */}
      {backwardMessages.map((message, index) => {
        // Calculate arrow position (only for first message)
        const arrowOffset = {
          x: backwardArrowBoxPosition.x,
          y: backwardArrowBoxPosition.y
        }
        
        // Calculate label position using old version's stacking logic
        let labelOffset: { x: number; y: number }
        
        // Following old version's computeBoundingBoxForMessages logic
        if (targetArrowDirection === "Left") {
          // ⟵ messages: center message, drawing from top to bottom
          labelOffset = {
            x: backwardLabelBoxPosition.x,
            y: backwardLabelBoxPosition.y + (index * 16) // Stack downward (positive y)
          }
        } else if (targetArrowDirection === "Up") {
          // ↑ messages: position to the left
          labelOffset = {
            x: backwardLabelBoxPosition.x,
            y: backwardLabelBoxPosition.y + (index * 16) // Stack downward
          }
        } else { // targetArrowDirection === "Down"
          // ↓ messages: position to the right
          labelOffset = {
            x: backwardLabelBoxPosition.x,
            y: backwardLabelBoxPosition.y + (index * 16) // Stack downward
          }
        }
        
        return (
          <div key={`backward-container-${index}`}>
            {/* Arrow box (only for first message) */}
            {index === 0 && (
              <div
                style={{
                  position: "absolute",
                  transform: `translate(${pathMiddlePosition.x + arrowOffset.x}px, ${pathMiddlePosition.y + arrowOffset.y}px) translate(-50%, -50%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: ZINDEX_LABEL,
                }}
                className="nodrag nopan"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    color: "black",
                    transform: `rotate(${backwardArrowRotation}deg)`,
                    transformOrigin: "center",
                  }}
                >
                  <path d="M2 12h20" />
                  <path d="m17 5 5 7-5 7" />
                </svg>
              </div>
            )}
            
            {/* Label box */}
            <div
              style={{
                position: "absolute",
                transform: targetArrowDirection === "Left"
                  ? `translate(${pathMiddlePosition.x + labelOffset.x}px, ${pathMiddlePosition.y + labelOffset.y}px) translate(0%, -50%)` // Left-anchored for horizontal bottom labels  
                  : targetArrowDirection === "Up"
                  ? `translate(${pathMiddlePosition.x + labelOffset.x}px, ${pathMiddlePosition.y + labelOffset.y}px) translate(-100%, -50%)` // Right-anchored for vertical left labels (expand left)
                  : `translate(${pathMiddlePosition.x + labelOffset.x}px, ${pathMiddlePosition.y + labelOffset.y}px) translate(0%, -50%)`, // Left-anchored for vertical right labels (expand right)
                fontSize: "10px",
                fontWeight: 700,
                color: "black",
                whiteSpace: "nowrap",
                pointerEvents: "none",
                zIndex: ZINDEX_LABEL,
                textAlign: targetArrowDirection === "Left" ? "left" : undefined, // Left-align for horizontal edge (bottom) labels
              }}
              className="nodrag nopan"
            >
              {message.text}
            </div>
          </div>
        )
      })}
    </EdgeLabelRenderer>
  )
}
