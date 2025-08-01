import { IPoint } from "@/edges"
import { useDiagramModifiable } from "@/hooks/useDiagramModifiable"
import { useIsOnlyThisElementSelected } from "@/hooks/useIsOnlyThisElementSelected"
import { DeleteIcon, EditIcon } from "../../Icon"
import { Box } from "../../ui"
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
              style={{
                width: "16px",
                height: "16px",
                backgroundColor: "#f8fafc",
                borderRadius: 4,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={(e) => {
                e.stopPropagation()
                onDeleteClick(e)
              }}
            >
              <DeleteIcon style={{ width: 16, height: 16 }} />
            </Box>
            <Box
              style={{
                width: "16px",
                height: "16px",
                backgroundColor: "#f8fafc",
                borderRadius: 4,
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
