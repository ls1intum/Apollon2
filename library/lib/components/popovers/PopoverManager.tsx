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
import { GenericPopover } from "./GenericPopover"

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
  elementId: string
  anchorEl: HTMLElement | null
  type: PopoverType
}

export const PopoverManager = ({
  elementId,
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

  const open = popoverElementId === elementId
  const onClose = () => setPopOverElementId(null)

  const node = nodes.find((node) => node.id === elementId)
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
    <GenericPopover
      id={`popover-${elementId}`}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={popoverOrigin.anchorOrigin}
      transformOrigin={popoverOrigin.transformOrigin}
      maxHeight={700}
    >
      <Component elementId={elementId} />
    </GenericPopover>
  ) : null
}
