import { NodeProps, type Node } from "@xyflow/react"
import { DefaultNodeWrapper } from "../wrappers"
import { useRef } from "react"
import { DefaultNodeProps } from "@/types"
import { SfcTransitionBranchNodeSVG } from "@/components"
import { NodeToolbar } from "@/components/toolbars/NodeToolbar"

export function SfcTransitionBranch({
  id,
  width,
  height,
  data: { name },
}: NodeProps<Node<DefaultNodeProps>>) {
  const svgWrapperRef = useRef<HTMLDivElement | null>(null)

  if (!width || !height) {
    return null
  }

  return (
    <DefaultNodeWrapper width={width} height={height} elementId={id}>
      <NodeToolbar elementId={id} />
      <div ref={svgWrapperRef}>
        <SfcTransitionBranchNodeSVG
          width={width}
          height={height}
          name={name}
          id={id}
        />
      </div>
    </DefaultNodeWrapper>
  )
}
