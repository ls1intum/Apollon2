import { useDiagramModifiable } from "@/hooks/useDiagramModifiable"
import { useIsOnlyThisElementSelected } from "@/hooks/useIsOnlyThisElementSelected"
import { Handle, Position } from "@xyflow/react"

interface Props {
  children: React.ReactNode
  width?: number
  height?: number
  elementId: string
  selected?: boolean
}

function calculateAdjustedQuarter(x: number): number {
  const quarter = x / 4 // Calculate 1/4 of x
  return Math.floor(quarter / 10) * 10 // Round down to nearest multiple of 10
}

export function DefaultNodeWrapper({
  elementId,
  children,
  width = 0,
  height = 0,
}: Props) {
  const adjustedWidth = calculateAdjustedQuarter(width)
  const adjustedHeight = calculateAdjustedQuarter(height)
  const selected = useIsOnlyThisElementSelected(elementId)
  const isDiagramModifiable = useDiagramModifiable()

  const selectedHandleStyle = {
    opacity: 0.6,
    padding: 4,
    backgroundColor: "rgb(99, 154, 242)",
    zIndex: 10,
    border: "0px",
  }

  const handleStyle = selected ? selectedHandleStyle : { border: "0px" }

  return (
    <>
      <Handle
        id="top-left"
        type="source"
        position={Position.Top}
        style={{
          left: adjustedWidth,
          ...handleStyle,
        }}
        isConnectable={isDiagramModifiable}
      />
      <Handle
        id="top"
        type="source"
        position={Position.Top}
        style={{
          ...handleStyle,
        }}
        isConnectable={isDiagramModifiable}
      />
      <Handle
        id="top-right"
        type="source"
        position={Position.Top}
        style={{
          left: width - adjustedWidth,
          ...handleStyle,
        }}
        isConnectable={isDiagramModifiable}
      />
      <Handle
        id="right-top"
        type="source"
        position={Position.Right}
        style={{
          top: adjustedHeight,
          ...handleStyle,
        }}
        isConnectable={isDiagramModifiable}
      />
      <Handle
        id="right"
        type="source"
        position={Position.Right}
        style={{
          ...handleStyle,
        }}
        isConnectable={isDiagramModifiable}
      />
      <Handle
        id="right-bottom"
        type="source"
        position={Position.Right}
        style={{
          top: height - adjustedHeight,
          ...handleStyle,
        }}
        isConnectable={isDiagramModifiable}
      />
      <Handle
        id="bottom-right"
        type="source"
        position={Position.Bottom}
        style={{
          left: width - adjustedWidth,
          ...handleStyle,
        }}
        isConnectable={isDiagramModifiable}
      />
      <Handle
        id="bottom"
        type="source"
        position={Position.Bottom}
        style={{
          ...handleStyle,
        }}
        isConnectable={isDiagramModifiable}
      />
      <Handle
        id="bottom-left"
        type="source"
        position={Position.Bottom}
        style={{
          left: adjustedWidth,
          ...handleStyle,
        }}
        isConnectable={isDiagramModifiable}
      />
      <Handle
        id="left-bottom"
        type="source"
        position={Position.Left}
        style={{
          top: height - adjustedHeight,
          ...handleStyle,
        }}
        isConnectable={isDiagramModifiable}
      />
      <Handle
        id="left"
        type="source"
        position={Position.Left}
        style={{
          ...handleStyle,
        }}
        isConnectable={isDiagramModifiable}
      />
      <Handle
        id="left-top"
        type="source"
        position={Position.Left}
        style={{
          top: adjustedHeight,
          ...(selected ? selectedHandleStyle : {}),
        }}
        isConnectable={isDiagramModifiable}
      />
      {children}
    </>
  )
}
