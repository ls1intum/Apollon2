import { Controls, useReactFlow, useStore } from "@xyflow/react"

export const CustomControls = () => {
  const { zoomTo } = useReactFlow()
  const zoomLevel = useStore((state) => state.transform[2])
  const zoomLevelPercent = Math.round(zoomLevel * 100)

  return (
    <Controls orientation="horizontal" showInteractive={false}>
      <div
        style={{
          userSelect: "none",
          backgroundColor: "white",
          border: "1px solid black",
          borderRadius: 8,
          paddingLeft: 1.5,
          paddingRight: 1.5,
          cursor: "pointer",
        }}
        onClick={() => zoomTo(1)}
      >
        {zoomLevelPercent}%
      </div>
    </Controls>
  )
}
