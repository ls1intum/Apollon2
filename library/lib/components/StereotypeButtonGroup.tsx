import React from "react"
import { Button, ButtonGroup } from "./ui"
import { ClassType } from "@/types"
import { useShallow } from "zustand/shallow"
import { useDiagramStore } from "@/store"

interface StereotypeButtonGroupProps {
  nodeId: string
  selectedStereotype?: ClassType
}

const stereotypes: ClassType[] = [
  ClassType.Abstract,
  ClassType.Interface,
  ClassType.Enumeration,
]

export const StereotypeButtonGroup: React.FC<StereotypeButtonGroupProps> = ({
  nodeId,
  selectedStereotype,
}) => {
  const { setNodes } = useDiagramStore(
    useShallow((state) => ({ setNodes: state.setNodes }))
  )

  const handleStereotypeChange = (stereotype: ClassType | undefined) => {
    const nextStereotype =
      selectedStereotype === stereotype ? undefined : stereotype

    const needsShrink = !!selectedStereotype && !nextStereotype
    const needExpand = !!nextStereotype && !selectedStereotype
    const nodeHeightDifference = needExpand ? 10 : needsShrink ? -10 : 0

    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              stereotype: nextStereotype,
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
