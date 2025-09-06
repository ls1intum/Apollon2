import { Box } from "@mui/material"
import { useReactFlow } from "@xyflow/react"
import { PopoverProps } from "../types"
import { Typography } from "@/components/ui"

export const SyntaxTreeEdgeEditPopover: React.FC<PopoverProps> = ({
  elementId,
}) => {
  const { getEdge } = useReactFlow()
  const edge = getEdge(elementId)

  if (!edge) {
    return null
  }

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
          Relationship
        </Typography>
      </div>
    </Box>
  )
}
