import { ReachabilityGraphMarkingProps } from "@/types"
import { useDiagramStore } from "@/store/context"
import { useShallow } from "zustand/shallow"
import { PopoverProps } from "../types"
import { DefaultNodeEditPopover } from "../DefaultNodeEditPopover"

export const ReachabilityGraphMarkingEditPopover: React.FC<PopoverProps> = ({
  elementId,
}) => {
  const { nodes, setNodes } = useDiagramStore(
    useShallow((state) => ({
      nodes: state.nodes,
      setNodes: state.setNodes,
    }))
  )

  const toggle = () => {
    setNodes((nodes) =>
      nodes.map((n) => {
        if (n.id === elementId) {
          return {
            ...n,
            data: {
              ...n.data,
              isInitialMarking: !n.data.isInitialMarking,
            },
          }
        }
        return n
      })
    )
  }

  const node = nodes.find((node) => node.id === elementId)
  if (!node) {
    return null
  }

  const nodeData = node.data as ReachabilityGraphMarkingProps

  return (
    <DefaultNodeEditPopover elementId={elementId}>
      <div
        onClick={toggle}
        style={{
          display: "flex",
          gap: 8,
          flex: 1,
          paddingTop: 8,
          paddingBottom: 8,
        }}
      >
        <input type="checkbox" checked={nodeData.isInitialMarking} readOnly />
        <div>Is Initial Marking</div>
      </div>
    </DefaultNodeEditPopover>
  )
}
