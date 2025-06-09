import { IPoint } from "@/edges"
import { useDiagramModifiable } from "@/hooks/useDiagramModifiable"
import { useIsOnlyThisElementSelected } from "@/hooks/useIsOnlyThisElementSelected"
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined"
import EditIcon from "@mui/icons-material/Edit"
import { Box } from "@mui/material"
import { forwardRef, ForwardedRef } from "react"

interface CustomEdgeToolbarProps {
  edgeId: string
  position: IPoint
  onEditClick: (event: React.MouseEvent<HTMLElement>) => void
  onDeleteClick: (event: React.MouseEvent<HTMLElement>) => void
}

// Use forwardRef to allow passing a ref to the component
export const CustomEdgeToolbar = forwardRef(
  (
    { edgeId, position, onEditClick, onDeleteClick }: CustomEdgeToolbarProps,
    ref: ForwardedRef<SVGForeignObjectElement>
  ) => {
    const isDiagramModifiable = useDiagramModifiable()

    const selected = useIsOnlyThisElementSelected(edgeId)

    const showToolbar = selected && isDiagramModifiable
    const foreignObjectStyle = showToolbar
      ? { borderRadius: 8, boxShadow: "0 0 4px 0 rgb(0 0 0 / .2)" }
      : {}

    return (
      <foreignObject
        ref={ref}
        width={32}
        height={56}
        x={position.x}
        y={position.y}
        style={foreignObjectStyle}
      >
        {showToolbar && (
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
        )}
      </foreignObject>
    )
  }
)

// Optional: Add display name for better debugging
CustomEdgeToolbar.displayName = "CustomEdgeToolbar"
