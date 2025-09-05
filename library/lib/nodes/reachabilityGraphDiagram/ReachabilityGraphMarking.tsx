import { NodeProps, NodeResizer, type Node } from "@xyflow/react"
import { DefaultNodeWrapper } from "../wrappers"
import { useHandleOnResize } from "@/hooks"
import { ReachabilityGraphMarkingProps } from "@/types"
import { useRef } from "react"
import { PopoverManager } from "@/components/popovers/PopoverManager"
import { useDiagramModifiable } from "@/hooks/useDiagramModifiable"
import { useIsOnlyThisElementSelected } from "@/hooks/useIsOnlyThisElementSelected"
import { ReachabilityGraphMarkingSVG } from "@/components/svgs/nodes/reachabilityGraphDiagram/ReachabilityGraphMarkingSVG"
import { NodeToolbar } from "@/components/toolbars/NodeToolbar"

export function ReachabilityGraphMarking({
  id,
  width,
  height,
  data: { name, isInitialMarking },
  parentId,
}: NodeProps<Node<ReachabilityGraphMarkingProps>>) {
  const svgWrapperRef = useRef<HTMLDivElement | null>(null)
  const { onResize } = useHandleOnResize(parentId)
  const isDiagramModifiable = useDiagramModifiable()
  const selected = useIsOnlyThisElementSelected(id)

  if (!width || !height) {
    return null
  }

  return (
    <DefaultNodeWrapper width={width} height={height} elementId={id}>
      <NodeToolbar elementId={id} />
      <NodeResizer
        isVisible={isDiagramModifiable && !!selected}
        onResize={onResize}
        minHeight={50}
        minWidth={50}
        handleStyle={{ width: 8, height: 8 }}
      />
      <div ref={svgWrapperRef}>
        <ReachabilityGraphMarkingSVG
          width={width}
          height={height}
          name={name}
          id={id}
          isInitialMarking={isInitialMarking}
          showAssessmentResults={!isDiagramModifiable}
        />
      </div>

      <PopoverManager
        anchorEl={svgWrapperRef.current}
        elementId={id}
        type="ReachabilityGraphMarking"
      />
    </DefaultNodeWrapper>
  )
}
