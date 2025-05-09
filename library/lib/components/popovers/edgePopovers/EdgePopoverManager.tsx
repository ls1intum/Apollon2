import { useMetadataStore } from "@/store"
import { usePopoverStore } from "@/store/context"
import { ApollonMode } from "@/types"
import { useShallow } from "zustand/shallow"

import { EdgeEditPopover } from ".."
import { EdgePopoverProps } from "../types"
import { useReactFlow } from "@xyflow/react"

interface Props {
  edgeId: string
  anchorEl: HTMLDivElement | SVGSVGElement | null | SVGPathElement
}

export const EdgePopoverManager: React.FC<Props> = ({ edgeId, anchorEl }) => {
  const { diagramMode, readonly } = useMetadataStore(
    useShallow((state) => ({
      diagramMode: state.mode,
      readonly: state.readonly,
    }))
  )
  const { getEdge } = useReactFlow()

  const edge = getEdge(edgeId)

  const { popoverElementId, setPopOverElementId } = usePopoverStore(
    useShallow((state) => ({
      popoverElementId: state.popoverElementId,
      setPopOverElementId: state.setPopOverElementId,
    }))
  )
  if (!anchorEl || !edge) {
    return null
  }

  const open = popoverElementId === edgeId
  const onClose = () => setPopOverElementId(null)

  let Component: React.FC<EdgePopoverProps> | null = null

  if (diagramMode === ApollonMode.Modelling && !readonly) {
    Component = EdgeEditPopover
  } else if (diagramMode === ApollonMode.Assessment) {
    Component = readonly ? EdgeEditPopover : EdgeEditPopover
  }

  const { source, target } = edge

  return Component ? (
    <Component
      source={source}
      target={target}
      edgeId={edgeId}
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
    />
  ) : null
}
