import { NodeProps, type Node } from "@xyflow/react"
import { DefaultNodeWrapper, FOUR_WAY_HANDLES_PRESET } from "../wrappers"
import { useRef } from "react"
import { PopoverManager } from "@/components/popovers/PopoverManager"
import { useDiagramModifiable } from "@/hooks/useDiagramModifiable"
import { BPMNStartEventProps } from "@/types"
import { BPMNEventNodeSVG } from "@/components"
import { NodeToolbar } from "@/components/toolbars/NodeToolbar"

export function BPMNStartEvent({
  id,
  width = 40,
  height = 40,
  data,
}: NodeProps<Node<BPMNStartEventProps>>) {
  const svgWrapperRef = useRef<HTMLDivElement | null>(null)
  const isDiagramModifiable = useDiagramModifiable()

  return (
    <DefaultNodeWrapper
      width={width}
      height={height}
      elementId={id}
      hiddenHandles={FOUR_WAY_HANDLES_PRESET}
    >
      <NodeToolbar elementId={id} />

      <div ref={svgWrapperRef}>
        <BPMNEventNodeSVG
          width={width}
          height={height}
          id={id}
          name={data.name}
          variant="start"
          eventType={data.eventType}
          showAssessmentResults={!isDiagramModifiable}
        />
      </div>
      <PopoverManager
        anchorEl={svgWrapperRef.current}
        elementId={id}
        type="BPMNStartEvent"
      />
    </DefaultNodeWrapper>
  )
}
