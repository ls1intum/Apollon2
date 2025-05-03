import { useMetadataStore } from "@/store"
import { useShallow } from "zustand/shallow"
import { ClassEditPopover } from "./ClassEditPopover"
import { ClassGiveFeedbackPopover } from "./ClassGiveFeedbackPopover"
import { ClassSeeFeedbackPopover } from "./ClassSeeFeedbackPopover"
import { ApollonMode } from "@/types"
import { usePopoverStore } from "@/store/context"

interface ClassPopoverManagerProps {
  nodeId: string
  anchorEl: HTMLElement | null
}
export const ClassPopoverManager = ({
  nodeId,
  anchorEl,
}: ClassPopoverManagerProps) => {
  const { diagramMode, readonly } = useMetadataStore(
    useShallow((state) => ({
      diagramMode: state.mode,
      readonly: state.readonly,
    }))
  )

  const { open, setPopOverElementId } = usePopoverStore(
    useShallow((state) => ({
      open: state.popoverElementId === nodeId,
      setPopOverElementId: state.setPopOverElementId,
    }))
  )

  const onClose = () => {
    setPopOverElementId(null)
  }

  if (diagramMode === ApollonMode.Modelling && !readonly) {
    return (
      <ClassEditPopover
        nodeId={nodeId}
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
      />
    )
  }

  if (diagramMode === ApollonMode.Assessment) {
    if (readonly) {
      return (
        <ClassSeeFeedbackPopover
          nodeId={nodeId}
          anchorEl={anchorEl}
          open={open}
          onClose={onClose}
        />
      )
    }

    return (
      <ClassGiveFeedbackPopover
        nodeId={nodeId}
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
      />
    )
  }
  return null
}
