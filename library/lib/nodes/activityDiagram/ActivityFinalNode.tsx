import { NodeProps, type Node } from "@xyflow/react"
import { DefaultNodeWrapper, HandleId } from "../wrappers"
import { DefaultNodeProps } from "@/types"
import { useRef } from "react"
import { PopoverManager } from "@/components/popovers/PopoverManager"
import { useDiagramModifiable } from "@/hooks/useDiagramModifiable"
import { ActivityFinalNodeSVG } from "@/components"
import { NodeToolbar } from "@/components/toolbars/NodeToolbar"

export function ActivityFinalNode({
  id,
  width,
  height,
}: NodeProps<Node<DefaultNodeProps>>) {
  const svgWrapperRef = useRef<HTMLDivElement | null>(null)

  const isDiagramModifiable = useDiagramModifiable()

  if (!width || !height) {
    return null
  }
  return (
    <DefaultNodeWrapper
      elementId={id}
      width={width}
      height={height}
      hiddenHandles={[
        HandleId.TopLeft,
        HandleId.TopRight,
        HandleId.RightTop,
        HandleId.RightBottom,
        HandleId.BottomRight,
        HandleId.BottomLeft,
        HandleId.LeftBottom,
        HandleId.LeftTop,
      ]}
    >
      <NodeToolbar elementId={id} />

      <div ref={svgWrapperRef}>
        <ActivityFinalNodeSVG
          width={width}
          height={height}
          id={id}
          showAssessmentResults={!isDiagramModifiable}
        />
      </div>

      <PopoverManager
        anchorEl={svgWrapperRef.current}
        elementId={id}
        type="default"
      />
    </DefaultNodeWrapper>
  )
}
