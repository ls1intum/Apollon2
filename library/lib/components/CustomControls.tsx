import { Controls, useReactFlow } from "@xyflow/react"

export const CustomControls = () => {
  const { zoomTo } = useReactFlow()

  return (
    <Controls orientation="horizontal" showInteractive={false}>
      <div
        style={{
          backgroundColor: "white",
          border: "1px solid black",
          borderRadius: 8,
          paddingLeft: 1.5,
          paddingRight: 1.5,
          cursor: "pointer",
        }}
        onClick={() => zoomTo(1)}
      >
        100%
      </div>
    </Controls>
  )
}
