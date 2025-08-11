import { NodeProps, type Node } from "@xyflow/react"
import { DefaultNodeWrapper } from "../wrappers"
import { DefaultNodeProps } from "@/types"
import { useRef } from "react"
import { PopoverManager } from "@/components/popovers/PopoverManager"
import { DeploymentArtifactSVG } from "@/components"

export function DeploymentArtifact({
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
      <div ref={svgWrapperRef}>
        <DeploymentArtifactSVG
          width={width}
          height={height}
          name={name}
          id={id}
          showAssessmentResults={false}
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
