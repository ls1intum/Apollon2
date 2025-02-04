
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined"
import EditIcon from "@mui/icons-material/Edit"
import { Box } from "@mui/material"

interface CustomEdgeToolbarProps {
  x: number
  y: number
  onEditClick: (event: React.MouseEvent<HTMLElement>) => void
  onDeleteClick: (event: React.MouseEvent<HTMLElement>) => void
}


export const CustomEdgeToolbar = ({
  x,
  y,
  onEditClick,
  onDeleteClick,
}: CustomEdgeToolbarProps) => {
  return (
    <foreignObject
      width={32}
      height={56}
      x={x}
      y={y}
      style={{ borderRadius: 8, boxShadow: "0 0 4px 0 rgb(0 0 0 / .2)" }}
    >
      <Box
        sx={{
          backgroundColor: "#f8fafc",
          boxShadow: "0 0 4px 0 rgb(0 0 0 / .2)",
          borderRadius: "8px",
          padding: "8px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          cursor: "pointer",
          gap: "8px",
        }}
      >
        <Box
          sx={{
            width: "16px",
            height: "16px",
            backgroundColor: "#f8fafc",
            borderRadius: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={(e) => {
            e.stopPropagation()
            onDeleteClick(e)
          }}
        >
          <DeleteOutlineOutlinedIcon style={{ width: 16, height: 16 }} />
        </Box>
        <Box
          sx={{
            width: "16px",
            height: "16px",
            backgroundColor: "#f8fafc",
            borderRadius: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={(e) => {
            e.stopPropagation()
            onEditClick(e)
          }}
        >
          <EditIcon style={{ width: 16, height: 16 }} />
        </Box>
      </Box>
    </foreignObject>
  )
}
