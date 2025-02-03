import { CustomEdgeToolbarProps } from "./CustomEdgeToolBarProps"

import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined"
import EditIcon from "@mui/icons-material/Edit"
import { Box } from "@mui/material"

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
          //width: "32px",
          //height: "56px",
          backgroundColor: "#f8fafc",
          boxShadow: "0 0 4px 0 rgb(0 0 0 / .2)",
          borderRadius: "8px",
          padding: "8px",
          display: "flex",
          flexDirection: "column",
          //justifyContent: "space-evenly",
          alignItems: "center",
          cursor: "pointer",
          gap: "8px",
        }}
      >
        {/* Optional Delete Icon */}
        <Box
          sx={{
            width: "16px",
            height: "16px",
            backgroundColor: "#f8fafc",
            borderRadius: "8px",
            //padding: "4px",
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
        {/* Edit Icon */}
        <Box
          sx={{
            width: "16px",
            height: "16px",
            backgroundColor: "#f8fafc",
            borderRadius: "8px",
            //padding: "4px",
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
