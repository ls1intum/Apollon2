import { ZINDEX_TOOLTIP } from "@/constants/zindexConstants"
import { IPoint } from "@/edges"
import { useDiagramModifiable } from "@/hooks/useDiagramModifiable"
import { useIsOnlyThisElementSelected } from "@/hooks/useIsOnlyThisElementSelected"
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined"
import EditIcon from "@mui/icons-material/Edit"
import { Box } from "@mui/material"
import { forwardRef, ForwardedRef, useMemo } from "react"

interface CustomEdgeToolbarProps {
  edgeId: string
  position: IPoint
  onEditClick: (event: React.MouseEvent<HTMLElement>) => void
  onDeleteClick: (event: React.MouseEvent<HTMLElement>) => void
}

export const CustomEdgeToolbar = forwardRef(
  (
    { edgeId, position, onEditClick, onDeleteClick }: CustomEdgeToolbarProps,
    ref: ForwardedRef<SVGForeignObjectElement>
  ) => {
    const isDiagramModifiable = useDiagramModifiable()
    const selected = useIsOnlyThisElementSelected(edgeId)

    const showToolbar = useMemo(() => {
      return selected && isDiagramModifiable
    }, [selected, isDiagramModifiable])

    const toolbarPosition = useMemo(() => {
      return {
        x: position.x - 16,
        y: position.y - 28,
      }
    }, [position.x, position.y, edgeId])

    const foreignObjectStyle = useMemo(() => {
      return showToolbar
        ? {
            borderRadius: 8,
            boxShadow: "0 0 4px 0 rgb(0 0 0 / .2)",
            opacity: 1,
            transition: "opacity 0.2s ease-in-out",
            zIndex: ZINDEX_TOOLTIP,
          }
        : { opacity: 1, zIndex: ZINDEX_TOOLTIP }
    }, [showToolbar])

    return (
      <foreignObject
        ref={ref}
        width={32}
        height={56}
        x={toolbarPosition.x + 20}
        y={toolbarPosition.y + 20}
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
              width: "100%",
              height: "100%",
              boxSizing: "border-box",
              WebkitTransform: "translateZ(0)",
              transform: "translateZ(0)",
              position: "relative",
              zIndex: ZINDEX_TOOLTIP,
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

CustomEdgeToolbar.displayName = "CustomEdgeToolbar"
