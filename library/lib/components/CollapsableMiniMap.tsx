import { useState } from "react"
import { MiniMap, Panel } from "@xyflow/react"
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap"
export const CollapsableMiniMap = () => {
  const [minimapCollapsed, setMinimapCollapsed] = useState(true)

  if (minimapCollapsed) {
    return (
      <Panel position="bottom-right" onClick={() => setMinimapCollapsed(false)}>
        <ZoomOutMapIcon />
      </Panel>
    )
  }

  return <MiniMap zoomable pannable onClick={() => setMinimapCollapsed(true)} />
}
