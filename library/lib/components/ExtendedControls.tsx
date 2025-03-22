import { Controls, useReactFlow } from "@xyflow/react"
import CenterFocusWeakIcon from "@mui/icons-material/CenterFocusWeak"

export const ExtendedControls = () => {
  const { zoomTo } = useReactFlow()

  return (
    <Controls orientation="horizontal">
      <div style={{ backgroundColor: "white" }} onClick={() => zoomTo(1)}>
        <CenterFocusWeakIcon />
      </div>
    </Controls>
  )
}
