import { Box, Typography } from "@mui/material"
import { TextField } from "@/components/ui"

import { useReactFlow } from "@xyflow/react"
import { CustomEdgeProps } from "@/edges/EdgeProps"
import { SwapHorizIcon } from "@/components/Icon"
import { useEdgePopOver } from "@/hooks"
import { PopoverProps } from "../types"

export const ActivityDiagramEdgeEditPopover: React.FC<PopoverProps> = ({
  elementId,
}) => {
  const { getEdge } = useReactFlow()
  const edge = getEdge(elementId)

  const { handleLabelChange, handleSwap } = useEdgePopOver(elementId)

  if (!edge) {
    return null
  }

  const edgeData = edge.data as CustomEdgeProps | undefined

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          Control Flow
        </Typography>
        {/* Swap icon for source/target swap */}
        {handleSwap && (
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <SwapHorizIcon style={{ cursor: "pointer" }} onClick={handleSwap} />
          </Box>
        )}
      </div>

      {/* Label update */}
      <TextField
        value={edgeData?.label ?? ""}
        onChange={(e) => handleLabelChange(e.target.value)}
        size="small"
        fullWidth
      />
    </Box>
  )
}
