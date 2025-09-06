import { TextField } from "@mui/material"
import { PetriNetPlaceProps } from "@/types"
import { useDiagramStore } from "@/store/context"
import { useShallow } from "zustand/shallow"
import { PopoverProps } from "../types"
import { DefaultNodeEditPopover } from "../DefaultNodeEditPopover"
import { DividerLine } from "@/components"
import { InfiniteIcon } from "@/components/Icon"

export const PetriNetPlaceEditPopover: React.FC<PopoverProps> = ({
  elementId,
}) => {
  const { nodes, setNodes } = useDiagramStore(
    useShallow((state) => ({
      nodes: state.nodes,
      setNodes: state.setNodes,
    }))
  )

  const handleTokensChange = (newTokens: number) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === elementId) {
          return {
            ...node,
            data: {
              ...node.data,
              tokens: newTokens,
            },
          }
        }
        return node
      })
    )
  }

  const handleCapacityChange = (
    newCapacity: number | "Infinity" | undefined
  ) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === elementId) {
          return {
            ...node,
            data: {
              ...node.data,
              capacity: newCapacity,
            },
          }
        }
        return node
      })
    )
  }
  const node = nodes.find((node) => node.id === elementId)
  if (!node) {
    return null
  }

  const nodeData = node.data as PetriNetPlaceProps

  return (
    <DefaultNodeEditPopover elementId={elementId}>
      <div
        style={{
          display: "flex",
          gap: 8,
          flex: 1,
          flexDirection: "column",
        }}
      >
        <DividerLine />
        <div
          style={{
            display: "flex",
            gap: 8,
            width: "100%",
            alignItems: "center",
          }}
        >
          <div>Tokens</div>

          <TextField
            variant="outlined"
            type="number"
            onChange={(event) => {
              const value = event.target.value
              if (value === "") {
                // Don't update immediately when empty, wait for blur or valid input
                return
              }
              const numValue = parseInt(value)
              if (!isNaN(numValue)) {
                handleTokensChange(numValue)
              }
            }}
            onBlur={(event) => {
              const value = event.target.value
              if (value === "") {
                handleTokensChange(0)
              }
            }}
            size="small"
            defaultValue={nodeData.tokens}
            fullWidth
            sx={{ backgroundColor: "#fff" }}
          />
        </div>

        <div
          style={{
            display: "flex",
            gap: 4,
            width: "100%",
            alignItems: "center",
          }}
        >
          <div>Capacity</div>

          <div style={{ position: "relative" }}>
            <TextField
              variant="outlined"
              type="number"
              onChange={(event) => {
                const value = event.target.value
                if (value === "") {
                  handleCapacityChange(undefined)
                } else {
                  const numValue = parseInt(value)
                  handleCapacityChange(isNaN(numValue) ? undefined : numValue)
                }
              }}
              size="small"
              value={
                nodeData.capacity === "Infinity"
                  ? ""
                  : (nodeData.capacity ?? "")
              }
              fullWidth
              sx={{ backgroundColor: "#fff" }}
            />
            {nodeData.capacity === "Infinity" && (
              <div style={{ position: "absolute", top: 12, left: 8 }}>
                <InfiniteIcon />
              </div>
            )}
          </div>
          <div
            onClick={() => handleCapacityChange("Infinity")}
            style={{ padding: 4 }}
          >
            <InfiniteIcon />
          </div>
        </div>
      </div>
    </DefaultNodeEditPopover>
  )
}
