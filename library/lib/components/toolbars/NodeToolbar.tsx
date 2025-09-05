import { useDiagramModifiable } from "@/hooks/useDiagramModifiable"
import { useHandleDelete } from "@/hooks/useHandleDelete"
import { useIsOnlyThisElementSelected } from "@/hooks/useIsOnlyThisElementSelected"
import { usePopoverStore } from "@/store"
import { Box } from "@mui/material"
import { Position, NodeToolbar as ReactFlowNodeToolbar } from "@xyflow/react"
import { FC } from "react"
import { useShallow } from "zustand/shallow"
import { DeleteIcon, EditIcon } from "../Icon"

interface Props {
  elementId: string
}
export const NodeToolbar: FC<Props> = ({ elementId }) => {
  const setPopOverElementId = usePopoverStore(
    useShallow((state) => state.setPopOverElementId)
  )
  const handleDelete = useHandleDelete(elementId)

  const isDiagramModifiable = useDiagramModifiable()
  const selected = useIsOnlyThisElementSelected(elementId)

  return (
    <ReactFlowNodeToolbar
      isVisible={isDiagramModifiable && !!selected}
      position={Position.Top}
      align="end"
      offset={10}
    >
      <Box sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
        <DeleteIcon
          onClick={handleDelete}
          style={{ cursor: "pointer", width: 16, height: 16 }}
        />

        <EditIcon
          onClick={() => {
            setPopOverElementId(elementId)
          }}
          style={{ cursor: "pointer", width: 16, height: 16 }}
        />
      </Box>
    </ReactFlowNodeToolbar>
  )
}
