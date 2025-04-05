import { Background, BackgroundVariant } from "@xyflow/react"

export const CustomBackground = () => (
  <>
    <Background
      id="1"
      gap={10}
      color="#e8ecf2"
      variant={BackgroundVariant.Lines}
    />

    <Background
      id="2"
      gap={50}
      color="#c1c5cb"
      variant={BackgroundVariant.Lines}
    />
  </>
)
