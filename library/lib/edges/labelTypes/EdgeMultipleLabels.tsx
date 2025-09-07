import { ZINDEX_LABEL } from "@/constants/zindexConstants"
import { IPoint } from "../Connection"
import { EdgeLabelRenderer } from "@xyflow/react"
import { MessageData } from "../EdgeProps"
import { useMessagePositioning } from "../../hooks"

export const EdgeMultipleLabels: React.FC<{
  messages?: MessageData[]
  pathMiddlePosition: IPoint
  showRelationshipLabels: boolean
  isReconnectingRef?: React.MutableRefObject<boolean>
  sourcePosition: IPoint
  targetPosition: IPoint
  edgePoints?: Array<{ x: number; y: number }>
  textColor: string
}> = ({
  messages,
  pathMiddlePosition,
  showRelationshipLabels,
  isReconnectingRef,
  sourcePosition,
  targetPosition,
  edgePoints,
  textColor,
}) => {
  const displayMessages: MessageData[] = messages || []

  const {
    forwardMessages,
    backwardMessages,
    forwardArrowRotation,
    backwardArrowRotation,
    forwardArrowBoxPosition,
    forwardLabelBoxPosition,
    backwardArrowBoxPosition,
    backwardLabelBoxPosition,
    isPositioned,
    isHorizontalEdge,
  } = useMessagePositioning(
    displayMessages,
    sourcePosition,
    targetPosition,
    pathMiddlePosition,
    edgePoints
  )

  if (
    !displayMessages ||
    displayMessages.length === 0 ||
    !showRelationshipLabels ||
    !isPositioned
  )
    return null

  if (isReconnectingRef?.current) return null

  const getMessageOffset = (index: number, isForward: boolean) => {
    const spacing = 25

    if (isHorizontalEdge) {
      if (isForward) {
        return { y: -index * spacing, x: 0 }
      } else {
        return { y: index * spacing, x: 0 }
      }
    } else {
      return { y: index * spacing, x: 0 }
    }
  }

  const renderMessages = (
    messageList: MessageData[],
    arrowBoxPosition: { x: number; y: number },
    labelBoxPosition: { x: number; y: number },
    arrowRotation: number,
    keyPrefix: string,
    isForward: boolean
  ) => {
    return messageList.map((message, index) => {
      const offset = getMessageOffset(index, isForward)

      return (
        <div key={`${keyPrefix}-${index}`}>
          {/* Arrow (only for first message in group) */}
          {index === 0 && (
            <div
              style={{
                position: "absolute",
                transform: `translate(${pathMiddlePosition.x + arrowBoxPosition.x}px, ${pathMiddlePosition.y + arrowBoxPosition.y}px) translate(-50%, -50%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: ZINDEX_LABEL,
                stroke: textColor,
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
                  color: textColor,
                  transform: `rotate(${arrowRotation}deg)`,
                  transformOrigin: "center",
                }}
              >
                <path d="M2 12h20" />
                <path d="m17 5 5 7-5 7" />
              </svg>
            </div>
          )}

          {/* Label */}
          <div
            style={{
              position: "absolute",
              transform: `translate(${pathMiddlePosition.x + labelBoxPosition.x + offset.x}px, ${pathMiddlePosition.y + labelBoxPosition.y + offset.y}px) translate(-50%, -50%)`,
              fontSize: "14px",
              fontWeight: 400,
              color: textColor,
              whiteSpace: "nowrap",
              pointerEvents: "none",
              zIndex: ZINDEX_LABEL,
              willChange: "transform",
            }}
            className="nodrag nopan"
          >
            {message.text}
          </div>
        </div>
      )
    })
  }

  return (
    <EdgeLabelRenderer>
      {/* Forward Messages (pointing to target) */}
      {renderMessages(
        forwardMessages,
        forwardArrowBoxPosition,
        forwardLabelBoxPosition,
        forwardArrowRotation,
        "forward",
        true // isForward = true
      )}

      {/* Backward Messages (pointing to source) */}
      {renderMessages(
        backwardMessages,
        backwardArrowBoxPosition,
        backwardLabelBoxPosition,
        backwardArrowRotation,
        "backward",
        false // isForward = false
      )}
    </EdgeLabelRenderer>
  )
}
