import { useState } from "react"
import { MiniMap, MiniMapNodeProps, Panel, useReactFlow } from "@xyflow/react"
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap"
import { ClassSVG, PackageSVG } from "./svgs"

export const CustomMiniMap = () => {
  const [minimapCollapsed, setMinimapCollapsed] = useState(true)

  if (minimapCollapsed) {
    return (
      <Panel position="bottom-right" onClick={() => setMinimapCollapsed(false)}>
        <ZoomOutMapIcon />
      </Panel>
    )
  }

  return (
    <MiniMap
      zoomable
      onClick={() => setMinimapCollapsed(true)}
      nodeComponent={MiniMapNode}
    />
  )
}

function MiniMapNode({ id, x, y }: MiniMapNodeProps) {
  const { getNode } = useReactFlow()

  const nodeInfo = getNode(id)!

  switch (nodeInfo.type) {
    case "class":
      return (
        <ClassSVG
          svgAttributes={{
            x,
            y,
          }}
          width={nodeInfo.width ?? 0}
          height={nodeInfo.height ?? 0}
          id={`minimap_${id}`}
          methods={(nodeInfo.data["methods"] as []) || []}
          attributes={(nodeInfo.data["attributes"] as []) || []}
          name={(nodeInfo.data.name as string) || ""}
        />
      )
    case "package":
      return (
        <PackageSVG
          width={nodeInfo.width ?? 0}
          height={nodeInfo.height ?? 0}
          id={`minimap_${id}`}
          name={(nodeInfo.data.name as string) || ""}
          svgAttributes={{
            x,
            y,
          }}
        />
      )

    default:
      return <rect x={x} y={y} width={100} height={100} fill="gray" />
  }
}
