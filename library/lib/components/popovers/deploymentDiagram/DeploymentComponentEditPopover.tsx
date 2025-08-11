import { useDiagramStore } from "@/store"
import { DeploymentComponentProps } from "@/types"
import { useShallow } from "zustand/shallow"
import { DefaultNodeEditPopover } from "../DefaultNodeEditPopover"
import { PopoverProps } from "../types"

export const DeploymentComponentEditPopover: React.FC<PopoverProps> = ({
  elementId,
}) => {
  const { nodes, setNodes } = useDiagramStore(
    useShallow((state) => ({ setNodes: state.setNodes, nodes: state.nodes }))
  )

  const node = nodes.find((node) => node.id === elementId)
  if (!node) {
    return null
  }

  const nodeData = node.data as DeploymentComponentProps

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

  const SwitchHeaderElement = (
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
      {"«»"}
    </div>
  )

  return (
    <DefaultNodeEditPopover
      elementId={elementId}
      sideElements={[SwitchHeaderElement]}
    />
  )
}
