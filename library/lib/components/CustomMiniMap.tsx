import { useState } from "react"
import { MiniMap, MiniMapNodeProps, Panel, useReactFlow } from "@xyflow/react"
import { ClassSVG, PackageSVG } from "./svgs"
import SouthEastIcon from "@mui/icons-material/SouthEast"
import MapIcon from "@mui/icons-material/Map"

export const CustomMiniMap = () => {
  const [minimapCollapsed, setMinimapCollapsed] = useState(true)

  if (minimapCollapsed) {
    return (
      <Panel position="bottom-right" onClick={() => setMinimapCollapsed(false)}>
        <MapIcon />
      </Panel>
    )
  }

  return (
    <Panel
      position="bottom-right"
      onClick={() => setMinimapCollapsed(true)}
      style={{ boxShadow: "none", backgroundColor: "transparent" }}
    >
      <div
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          display: "flex",
          zIndex: 10,
          padding: 8,
          backgroundColor: "white",
          borderRadius: "4px",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          boxShadow: "0 0 4px 0 rgb(0 0 0 / 0.2)",
        }}
      >
        <SouthEastIcon width={16} height={16} />
      </div>

      <MiniMap
        zoomable
        onClick={() => setMinimapCollapsed(true)}
        nodeComponent={MiniMapNode}
        offsetScale={20}
        style={{ zIndex: 5 }}
      />
    </Panel>
  )
}

function MiniMapNode({ id, x, y }: MiniMapNodeProps) {
  const { getNode } = useReactFlow()

  const nodeInfo = getNode(id)
  if (!nodeInfo) return null

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
