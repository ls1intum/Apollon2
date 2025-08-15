import { NodeProps, NodeToolbar, Position, type Node } from "@xyflow/react"
import { DefaultNodeWrapper, FOUR_WAY_HANDLES_PRESET } from "../wrappers"
import Box from "@mui/material/Box"
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined"
import EditIcon from "@mui/icons-material/Edit"
import { useRef } from "react"
import { usePopoverStore } from "@/store/context"
import { useShallow } from "zustand/shallow"
import { useHandleDelete } from "@/hooks/useHandleDelete"
import { PopoverManager } from "@/components/popovers/PopoverManager"
import { useDiagramModifiable } from "@/hooks/useDiagramModifiable"
import { useIsOnlyThisElementSelected } from "@/hooks/useIsOnlyThisElementSelected"
import { BPMNGatewayProps } from "@/types"
import { BPMNGatewayNodeSVG } from "@/components"

export function BPMNGateway({
  id,
  width = 40,
  height = 40,
  data,
}: NodeProps<Node<BPMNGatewayProps>>) {
  const svgWrapperRef = useRef<HTMLDivElement | null>(null)
  const isDiagramModifiable = useDiagramModifiable()
  const selected = useIsOnlyThisElementSelected(id)
  const setPopOverElementId = usePopoverStore(
    useShallow((state) => state.setPopOverElementId)
  )
  const handleDelete = useHandleDelete(id)

  return (
    <DefaultNodeWrapper
      width={width}
      height={height}
      elementId={id}
      hiddenHandles={FOUR_WAY_HANDLES_PRESET}
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
        <BPMNGatewayNodeSVG
          width={width}
          height={height}
          id={id}
          name={data.name}
          gatewayType={data.gatewayType}
        />
      </div>
      <PopoverManager
        anchorEl={svgWrapperRef.current}
        elementId={id}
        type="BPMNGateway"
      />
    </DefaultNodeWrapper>
  )
}
