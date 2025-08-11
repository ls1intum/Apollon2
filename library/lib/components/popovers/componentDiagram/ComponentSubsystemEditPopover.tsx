import { ComponentSubsystemNodeProps } from "@/types"
import { DefaultNodeEditPopover } from "../DefaultNodeEditPopover"
import { PopoverProps } from "../types"
import { useDiagramStore } from "@/store"
import { useShallow } from "zustand/shallow"

export const ComponentSubsystemEditPopover: React.FC<PopoverProps> = ({
  elementId,
}: PopoverProps) => {
  const { nodes, setNodes } = useDiagramStore(
    useShallow((state) => ({
      nodes: state.nodes,
      setNodes: state.setNodes,
    }))
  )

  const node = nodes.find((node) => node.id === elementId)
  if (!node) {
    return null
  }

  const nodeData = node.data as ComponentSubsystemNodeProps

  const switchHeaderShown = () => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === elementId) {
          return {
            ...node,
            data: {
              ...node.data,
              isComponentSubsystemHeaderShown:
                !nodeData.isComponentSubsystemHeaderShown,
            },
          }
        }
        return node
      })
    )
  }

  return (
    <DefaultNodeEditPopover elementId={elementId}>
      <div
        onClick={switchHeaderShown}
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
          ...(nodeData.isComponentSubsystemHeaderShown && {
            background:
              "linear-gradient(to top right, transparent calc(50% - 1px), black 50%, transparent calc(50% + 1px))",
          }),
        }}
      >
        {"«»"}
      </div>
    </DefaultNodeEditPopover>
  )
}
