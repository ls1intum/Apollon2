import { useMetadataStore } from "@/store"
import { useDiagramStore, usePopoverStore } from "@/store/context"
import { ApollonMode, LocationPopover } from "@/types"
import { useShallow } from "zustand/shallow"
import {
  ClassEditPopover,
  ClassGiveFeedbackPopover,
  ClassSeeFeedbackPopover,
  PackageEditPopover,
} from "./classDiagram"
import { useViewportCenter } from "@/hooks"
import { getPopoverOrigin, getPositionOnCanvas, getQuadrant } from "@/utils"
import { PopoverProps } from "./types"

type PopoverType = "class" | "package"

const editPopovers: {
  class: React.FC<PopoverProps>
  package: React.FC<PopoverProps>
} = {
  class: ClassEditPopover,
  package: PackageEditPopover,
}

const giveFeedbackPopovers: {
  class: React.FC<PopoverProps>
  package: React.FC<PopoverProps>
} = {
  class: ClassGiveFeedbackPopover,
  package: PackageEditPopover,
}

const seeFeedbackPopovers: {
  class: React.FC<PopoverProps>
  package: React.FC<PopoverProps>
} = {
  class: ClassSeeFeedbackPopover,
  package: PackageEditPopover,
}

interface PopoverManagerProps {
  nodeId: string
  anchorEl: HTMLElement | null
  type: PopoverType
}

export const PopoverManager = ({
  nodeId,
  anchorEl,
  type,
}: PopoverManagerProps) => {
  const viewportCenter = useViewportCenter()

  const { nodes } = useDiagramStore(
    useShallow((state) => ({
      nodes: state.nodes,
    }))
  )

  const { diagramMode, readonly } = useMetadataStore(
    useShallow((state) => ({
      diagramMode: state.mode,
      readonly: state.readonly,
    }))
  )

  const { popoverElementId, setPopOverElementId } = usePopoverStore(
    useShallow((state) => ({
      popoverElementId: state.popoverElementId,
      setPopOverElementId: state.setPopOverElementId,
    }))
  )

  const open = popoverElementId === nodeId
  const onClose = () => setPopOverElementId(null)

  const node = nodes.find((node) => node.id === nodeId)
  let popoverOrigin: LocationPopover = {
    anchorOrigin: { vertical: "top", horizontal: "right" },
    transformOrigin: { vertical: "top", horizontal: "left" },
  }

  if (node && anchorEl && open) {
    const nodePositionOnCanvas = getPositionOnCanvas(node, nodes)
    const quadrant = getQuadrant(nodePositionOnCanvas, viewportCenter)
    popoverOrigin = getPopoverOrigin(quadrant)
  }

  let Component: React.ComponentType<PopoverProps> | null = null

  if (diagramMode === ApollonMode.Modelling && !readonly) {
    Component = editPopovers[type] ?? null
  } else if (diagramMode === ApollonMode.Assessment) {
    Component = readonly
      ? (seeFeedbackPopovers[type] ?? null)
      : (giveFeedbackPopovers[type] ?? null)
  }

  return Component ? (
    <Component
      nodeId={nodeId}
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      popoverOrigin={popoverOrigin}
    />
  ) : null
}
