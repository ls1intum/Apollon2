import { Background, BackgroundVariant } from "@xyflow/react"

export const CustomBackground = () => {
  return (
    <>
      <Background
        id="1"
        gap={10}
        color="var(--apollon2-gray)"
        variant={BackgroundVariant.Lines}
      />

      <Background
        id="2"
        gap={50}
        color="var(--apollon2-grid)"
        variant={BackgroundVariant.Lines}
      />
    </>
  )
}
