import { ZINDEX_LABEL } from "@/constants/zindexConstants"
import { IPoint } from "../Connection"
import { EdgeLabelRenderer } from "@xyflow/react"
import { MessageData } from "../EdgeProps"
import { calculateOffsets } from "@/utils"
import { useMessagePositioning } from "../../hooks"

export const EdgeMultipleLabels: React.FC<{
  labels: string[]
  messages?: MessageData[]
  pathMiddlePosition: IPoint
  isMiddlePathHorizontal: boolean
  showRelationshipLabels: boolean
  isReconnectingRef?: React.MutableRefObject<boolean>
}> = ({
  labels,
  messages,
  pathMiddlePosition,
  isMiddlePathHorizontal,
  showRelationshipLabels,
  isReconnectingRef,
}) => {
  const displayMessages: MessageData[] =
    messages ||
    labels.map((label) => ({
      text: label,
      direction: "forward" as const,
    }))

  if (
    !displayMessages ||
    displayMessages.length === 0 ||
    !showRelationshipLabels
  )
    return null

  if (isReconnectingRef?.current) return null

  const {
    forwardMessages,
    backwardMessages,
    sourceArrowDirection,
    targetArrowDirection,
    forwardArrowRotation,
    backwardArrowRotation,
    forwardArrowBoxPosition,
    forwardLabelBoxPosition,
    backwardArrowBoxPosition,
    backwardLabelBoxPosition,
    isPositioned,
  } = useMessagePositioning(displayMessages, isMiddlePathHorizontal)

  if (!isPositioned) {
    return null
  }

  return (
    <EdgeLabelRenderer>
      {forwardMessages.map((message, index) => {
        const { arrowOffset, labelOffset } = calculateOffsets(
          forwardArrowBoxPosition,
          forwardLabelBoxPosition,
          sourceArrowDirection,
          index
        )

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

            <div
              style={{
                position: "absolute",
                transform:
                  sourceArrowDirection === "Right"
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
                textAlign:
                  sourceArrowDirection === "Right" ? "left" : undefined,
                willChange: "transform",
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
        const { arrowOffset, labelOffset } = calculateOffsets(
          backwardArrowBoxPosition,
          backwardLabelBoxPosition,
          targetArrowDirection,
          index
        )

        return (
          <div key={`backward-container-${index}`}>
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

            <div
              style={{
                position: "absolute",
                transform:
                  targetArrowDirection === "Left"
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
                textAlign: targetArrowDirection === "Left" ? "left" : undefined,
                willChange: "transform",
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
