import { NodeProps, NodeToolbar, Position, type Node } from "@xyflow/react"
import { PetriNetPlaceSVG } from "@/components"
import EditIcon from "@mui/icons-material/Edit"
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined"
import { useRef } from "react"
import { Box } from "@mui/material"
import { PetriNetPlaceProps } from "@/types"
import { usePopoverStore } from "@/store/context"
import { useShallow } from "zustand/shallow"
import { useHandleDelete } from "@/hooks/useHandleDelete"
import { PopoverManager } from "@/components/popovers/PopoverManager"
import { useDiagramModifiable } from "@/hooks/useDiagramModifiable"
import { useIsOnlyThisElementSelected } from "@/hooks/useIsOnlyThisElementSelected"
import { DefaultNodeWrapper, HandleId } from "../wrappers"

export function PetriNetPlace({
  id,
  width,
  height,
  data: { name, tokens, capacity },
}: NodeProps<Node<PetriNetPlaceProps>>) {
  const svgWrapperRef = useRef<HTMLDivElement | null>(null)
  const isDiagramModifiable = useDiagramModifiable()
  const selected = useIsOnlyThisElementSelected(id)
  const setPopOverElementId = usePopoverStore(
    useShallow((state) => state.setPopOverElementId)
  )
  const handleDelete = useHandleDelete(id)

  if (!width || !height) {
    return null
  }

  return (
    <DefaultNodeWrapper
      elementId={id}
      width={width}
      height={height}
      hiddenHandles={[
        HandleId.TopLeft,
        HandleId.TopRight,
        HandleId.RightTop,
        HandleId.RightBottom,
        HandleId.BottomRight,
        HandleId.BottomLeft,
        HandleId.LeftBottom,
        HandleId.LeftTop,
      ]}
    >
      <NodeToolbar
        isVisible={isDiagramModifiable && !!selected}
        position={Position.Top}
        align="end"
        offset={10}
      >
        <Box sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
          <DeleteOutlineOutlinedIcon
            onClick={handleDelete}
            style={{ cursor: "pointer", width: 16, height: 16 }}
          />

          <EditIcon
            onClick={() => {
              setPopOverElementId(id)
            }}
            style={{ cursor: "pointer", width: 16, height: 16 }}
          />
        </Box>
      </NodeToolbar>

      <div ref={svgWrapperRef}>
        <PetriNetPlaceSVG
          width={width}
          height={height}
          id={id}
          showAssessmentResults={!isDiagramModifiable}
          name={name}
          tokens={tokens}
          capacity={capacity}
        />
      </div>

      <PopoverManager
        anchorEl={svgWrapperRef.current}
        elementId={id}
        type="PetriNetPlace"
      />
    </DefaultNodeWrapper>
  )
}
