import React from "react"
import { Button, ButtonGroup } from "@mui/material"
import { ClassType } from "@/types"
import { useShallow } from "zustand/shallow"
import { useDiagramStore } from "@/store"

interface StereotypeButtonGroupProps {
  nodeId: string
}

const stereotypes: ClassType[] = [
  ClassType.Abstract,
  ClassType.Interface,
  ClassType.Enumeration,
]

export const StereotypeButtonGroup: React.FC<StereotypeButtonGroupProps> = ({
  nodeId,
}) => {
  const { nodes, setNodes } = useDiagramStore(
    useShallow((state) => ({ nodes: state.nodes, setNodes: state.setNodes }))
  )
  const selectedStereotype = nodes.find((node) => node.id === nodeId)?.data
    ?.stereotype

  const handleStereotypeChange = (stereotype: ClassType | undefined) => {
    const needExpand =
      selectedStereotype !== stereotype &&
      selectedStereotype === undefined &&
      stereotype !== undefined
    const needShrink =
      selectedStereotype !== undefined && stereotype === undefined
    const nodeHeightDifference = needExpand ? 10 : needShrink ? -10 : 0

    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              stereotype,
            },
            height: node.height! + nodeHeightDifference,
            measured: {
              ...node.measured,
              height: node.height! + nodeHeightDifference,
            },
          }
        }
        return node
      })
    )
  }

  return (
    <ButtonGroup aria-label="Stereotype selection" size="small">
      {stereotypes.map((stereotype) => (
        <Button
          key={stereotype}
          variant={selectedStereotype === stereotype ? "contained" : "outlined"}
          onClick={() => handleStereotypeChange(stereotype)}
        >
          {stereotype}
        </Button>
      ))}
    </ButtonGroup>
  )
}
