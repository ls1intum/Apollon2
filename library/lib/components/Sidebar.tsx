import React from "react"
import {
  dropElementConfigs,
  transformScale,
} from "@/constants/dropElementConfig"
import { DividerLine } from "./DividerLine"
import { useMetadataStore } from "@/store/context"
import { useShallow } from "zustand/shallow"
import { DraggableGhost } from "./DraggableGhost"

/* ========================================================================
   Sidebar Component
   Renders the draggable elements based on the selected diagram type.
   ======================================================================== */

export const Sidebar = () => {
  const diagramType = useMetadataStore(useShallow((state) => state.diagramType))

  if (dropElementConfigs[diagramType].length === 0) {
    return null
  }

  return (
    <aside
      style={{
        height: "100%",
        backgroundColor: "#f0f0f0",
        display: "flex",
        flexDirection: "column",
        padding: "10px",
        gap: "15px",
        alignItems: "center",
      }}
    >
      {dropElementConfigs[diagramType].map((config, index) => (
        <React.Fragment key={`${config.type}_${config.defaultData?.name}`}>
          {config.type === "colorDescription" && (
            <DividerLine style={{ margin: "3px 0" }} height={2} />
          )}
          <DraggableGhost dropElementConfig={config}>
            <div
              className="prevent-select"
              style={{
                width: config.width * transformScale,
                height: config.height * transformScale,
                zIndex: 2,
                marginTop: config.marginTop,
              }}
            >
              {React.createElement(config.svg, {
                width: config.width,
                height: config.height,
                ...config.defaultData,
                transformScale,
                id: `sidebarElement_${index}`,
              })}
            </div>
          </DraggableGhost>
        </React.Fragment>
      ))}
    </aside>
  )
}
