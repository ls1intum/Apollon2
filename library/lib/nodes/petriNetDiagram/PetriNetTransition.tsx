import { NodeProps, NodeResizer, type Node } from "@xyflow/react"
import { DefaultNodeWrapper } from "@/nodes/wrappers"
import { PetriNetTransitionSVG } from "@/components"
import { useRef } from "react"
import { DefaultNodeProps } from "@/types"
import { PopoverManager } from "@/components/popovers/PopoverManager"
import { useDiagramModifiable } from "@/hooks/useDiagramModifiable"
import { useIsOnlyThisElementSelected } from "@/hooks/useIsOnlyThisElementSelected"
import { NodeToolbar } from "@/components/toolbars/NodeToolbar"

export function PetriNetTransition({
  id,
  width,
  height,
  data: { name },
}: NodeProps<Node<DefaultNodeProps>>) {
  const svgWrapperRef = useRef<HTMLDivElement | null>(null)

  const isDiagramModifiable = useDiagramModifiable()
  const selected = useIsOnlyThisElementSelected(id)

  if (!width || !height) {
    return null
  }

  return (
    <DefaultNodeWrapper elementId={id} width={width} height={height}>
      <NodeToolbar elementId={id} />
      <NodeResizer
        isVisible={isDiagramModifiable && !!selected}
        minWidth={40}
        minHeight={40}
      />

      <div ref={svgWrapperRef}>
        <PetriNetTransitionSVG
          width={width}
          height={height}
          id={id}
          showAssessmentResults={!isDiagramModifiable}
          name={name}
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
