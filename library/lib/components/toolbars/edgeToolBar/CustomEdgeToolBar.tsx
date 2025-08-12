import { IPoint } from "@/edges"
import { useDiagramModifiable } from "@/hooks/useDiagramModifiable"
import { useIsOnlyThisElementSelected } from "@/hooks/useIsOnlyThisElementSelected"
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined"
import EditIcon from "@mui/icons-material/Edit"
import { Box, Tooltip } from "@mui/material"
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

    // Memoize toolbar visibility to prevent unnecessary re-renders
    const showToolbar = useMemo(() => {
      return selected && isDiagramModifiable
    }, [selected, isDiagramModifiable])
    // Memoize positioning to prevent flickering during transitions
    const toolbarPosition = useMemo(() => {
      return {
        x: position.x - 16, // Center the 32px toolbar horizontally
        y: position.y - 28, // Position above the middle point vertically
      }
    }, [position.x, position.y, edgeId])

    const foreignObjectStyle = useMemo(() => {
      return showToolbar
        ? {
            borderRadius: 8,
            boxShadow: "0 0 4px 0 rgb(0 0 0 / .2)",
            opacity: 0,
            transition: "opacity 0.2s ease-in-out",
          }
        : { opacity: 0 }
    }, [showToolbar])

    return (
      <foreignObject
        ref={ref}
        width={32}
        height={56}
        x={toolbarPosition.x}
        y={toolbarPosition.y}
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
              // Safari-specific fixes for foreignObject
              width: "100%",
              height: "100%",
              boxSizing: "border-box",
              WebkitTransform: "translateZ(0)", // Force hardware acceleration
              transform: "translateZ(0)",
              position: "relative",
            }}
          >
            {/* Delete Button with Tooltip Wrapper to fix MUI warning */}
            <Tooltip title="Delete edge" placement="left">
              <span>
                {/* Wrapper span to fix MUI warning */}
                <Box
                  component="button"
                  sx={{
                    width: "16px",
                    height: "16px",
                    minWidth: "16px", // Safari fix
                    minHeight: "16px", // Safari fix
                    backgroundColor: "#f8fafc",
                    borderRadius: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    margin: 0, // Safari fix
                    outline: "none", // Safari fix
                    position: "relative", // Safari fix
                    "&:hover": {
                      backgroundColor: "#fee2e2",
                    },
                    // Safari-specific fixes
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    appearance: "none",
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteClick(e)
                  }}
                  disabled={!isDiagramModifiable}
                >
                  <DeleteOutlineOutlinedIcon
                    style={{
                      width: 16,
                      height: 16,
                      display: "block", // Safari fix
                      lineHeight: 1, // Safari fix
                    }}
                  />
                </Box>
              </span>
            </Tooltip>

            {/* Edit Button with Tooltip Wrapper to fix MUI warning */}
            <Tooltip title="Edit edge" placement="left">
              <span>
                {" "}
                {/* Wrapper span to fix MUI warning */}
                <Box
                  component="button"
                  sx={{
                    width: "16px",
                    height: "16px",
                    minWidth: "16px", // Safari fix
                    minHeight: "16px", // Safari fix
                    backgroundColor: "#f8fafc",
                    borderRadius: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    margin: 0, // Safari fix
                    outline: "none", // Safari fix
                    position: "relative", // Safari fix
                    "&:hover": {
                      backgroundColor: "#e0e7ff",
                    },
                    // Safari-specific fixes
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    appearance: "none",
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    onEditClick(e)
                  }}
                  disabled={!isDiagramModifiable}
                >
                  <EditIcon
                    style={{
                      width: 16,
                      height: 16,
                      display: "block", // Safari fix
                      lineHeight: 1, // Safari fix
                    }}
                  />
                </Box>
              </span>
            </Tooltip>
          </Box>
        )}
      </foreignObject>
    )
  }
)

CustomEdgeToolbar.displayName = "CustomEdgeToolbar"
