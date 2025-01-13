import React, { DragEvent } from "react"
import { dropElementConfig, transformScale } from "@/constants"
import { DividerLine } from "./DividerLine"
import { DropNodeData } from "@/types"

const onDragStart = (event: DragEvent, { type, data }: DropNodeData) => {
  const rect = (event.target as HTMLElement).getBoundingClientRect()
  const offsetX = (event.clientX - rect.left) / transformScale // Cursor offset from the element's left
  const offsetY = (event.clientY - rect.top) / transformScale // Cursor offset from the element's top

  // Pass the offset along with the type and data
  // This offset will be used to position the element on drop
  event.dataTransfer.setData(
    "text/plain",
    JSON.stringify({ type, data, offsetX, offsetY })
  )
  event.dataTransfer.effectAllowed = "move"
}

export const Sidebar = () => {
  return (
    <aside style={{ height: "100%", backgroundColor: "#f0f0f0" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          margin: "10px",
        }}
      >
        {dropElementConfig.map((config) => (
          <React.Fragment key={`${config.type}_${config.name}`}>
            {/* Add separator before the Color Description */}
            {config.type === "colorDescription" && (
              <DividerLine style={{ margin: "3px 0" }} height={2} />
            )}
            <div
              style={{
                width: config.width * transformScale,
                height: config.height * transformScale,
                overflow: "hidden",
                zIndex: 2,
              }}
              draggable
              onDragStart={(event: DragEvent) =>
                onDragStart(event, {
                  type: config.type,
                  data: config.defaultData,
                  offsetX: 0,
                  offsetY: 0,
                })
              }
            >
              {React.createElement(config.svg, {
                width: config.width,
                height: config.height,
                ...config.defaultData,
                transformScale,
                id: "1",
              })}
            </div>
          </React.Fragment>
        ))}
      </div>
    </aside>
  )
}
