import { useMetadataStore } from "@/store"
import { useDiagramStore, usePopoverStore } from "@/store/context"
import { ApollonMode } from "@/typings"
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
import { PackageGiveFeedbackPopover } from "./classDiagram/PackageGiveFeedbackPopover"
import { PackageSeeFeedbackPopover } from "./classDiagram/PackageSeeFeedbackPopover"
import {
  EdgeEditPopover,
  EdgeGiveFeedbackPopover,
  EdgeSeeFeedbackPopover,
} from "./edgePopovers"
import { LocationPopover } from "@/types"

type PopoverType = "class" | "package" | "edge"

const editPopovers: {
  class: React.FC<PopoverProps>
  package: React.FC<PopoverProps>
  edge: React.FC<PopoverProps>
} = {
  class: ClassEditPopover,
  package: PackageEditPopover,
  edge: EdgeEditPopover,
}

const giveFeedbackPopovers: {
  class: React.FC<PopoverProps>
  package: React.FC<PopoverProps>
  edge: React.FC<PopoverProps>
} = {
  class: ClassGiveFeedbackPopover,
  package: PackageGiveFeedbackPopover,
  edge: EdgeGiveFeedbackPopover,
}

const seeFeedbackPopovers: {
  class: React.FC<PopoverProps>
  package: React.FC<PopoverProps>
  edge: React.FC<PopoverProps>
} = {
  class: ClassSeeFeedbackPopover,
  package: PackageSeeFeedbackPopover,
  edge: EdgeSeeFeedbackPopover,
}

interface PopoverManagerProps {
  elementId: string
  anchorEl: HTMLElement | SVGSVGElement | null
  type: PopoverType
}

export const PopoverManager = ({
  elementId,
  anchorEl,
  type,
}: PopoverManagerProps) => {
  const viewportCenter = useViewportCenter()
  const { nodes, interactiveElementId, setInteractiveElementId } =
    useDiagramStore(
      useShallow((state) => ({
        nodes: state.nodes,
        interactiveElementId: state.interactiveElementId,
        setInteractiveElementId: state.setInteractiveElementId,
      }))
    )

  const { diagramMode, readonly } = useMetadataStore(
    useShallow((state) => ({
      diagramMode: state.mode,
      readonly: state.readonly,
    }))
  )
  const { popoverElementId, popupEnabled, setPopOverElementId } =
    usePopoverStore(
      useShallow((state) => ({
        popoverElementId: state.popoverElementId,
        popupEnabled: state.popupEnabled,
        setPopOverElementId: state.setPopOverElementId,
      }))
    )

  if (!anchorEl || !popupEnabled) {
    return null
  }

  const open =
    popoverElementId === elementId && elementId === interactiveElementId
  const onClose = () => {
    setInteractiveElementId(null)
    setPopOverElementId(null)
  }

  let popoverOrigin: LocationPopover = {
    anchorOrigin: { vertical: "top", horizontal: "right" },
    transformOrigin: { vertical: "top", horizontal: "left" },
  }

  const node = nodes.find((node) => node.id === elementId)
  if (node && anchorEl && open) {
    const nodePositionOnCanvas = getPositionOnCanvas(node, nodes)
    const quadrant = getQuadrant(nodePositionOnCanvas, viewportCenter)
    popoverOrigin = getPopoverOrigin(quadrant)
  }

  let Component: React.ComponentType<PopoverProps> | null = null

  const isEditing = diagramMode === ApollonMode.Modelling && !readonly
  const isGivingFeedback = diagramMode === ApollonMode.Assessment && !readonly
  const isSeeingFeedback = diagramMode === ApollonMode.Assessment && readonly

  if (isEditing) {
    Component = editPopovers[type] ?? null
  } else if (isGivingFeedback) {
    Component = giveFeedbackPopovers[type] ?? null
  } else if (isSeeingFeedback) {
    Component = seeFeedbackPopovers[type] ?? null
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
      maxWidth={isEditing ? 500 : 400}
    >
      <Component elementId={elementId} />
    </GenericPopover>
  ) : null
}
