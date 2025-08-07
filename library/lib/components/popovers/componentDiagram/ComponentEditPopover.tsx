import { ComponentNodeProps } from "@/types"
import { DefaultNodeEditPopover } from "../DefaultNodeEditPopover"
import { PopoverProps } from "../types"
import { useDiagramStore } from "@/store"
import { useShallow } from "zustand/shallow"

export const ComponentEditPopover: React.FC<PopoverProps> = ({
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

  const nodeData = node.data as ComponentNodeProps

  const switchHeaderShown = () => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === elementId) {
          return {
            ...node,
            data: {
              ...node.data,
              isComponentHeaderShown: !nodeData.isComponentHeaderShown,
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
          ...(nodeData.isComponentHeaderShown && {
            background:
              "linear-gradient(to top right, transparent calc(50% - 1px), black 50%, transparent calc(50% + 1px))",
          }),
        }}
      >
        {"<<>>"}
      </div>
    </DefaultNodeEditPopover>
  )
}
