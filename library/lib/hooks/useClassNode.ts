import { useEffect, useState } from "react"
import { useDiagramStore } from "@/store"
import { useShallow } from "zustand/shallow"

export function useClassNode({
  id,
  selected,
}: {
  id: string
  selected: boolean
}) {
  const setNodes = useDiagramStore(useShallow((state) => state.setNodes))
  const [anchorEl, setAnchorEl] = useState<SVGSVGElement | null>(null)

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

  const handleNameChange = (newName: string) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              name: newName,
            },
          }
        }
        return node
      })
    )
  }
  const handleDelete = () => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id))
  }

  useEffect(() => {
    if (!selected) {
      handlePopoverClose()
    }
  }, [selected])

  return {
    anchorEl,
    handlePopoverClose,
    handleNameChange,
    handleDelete,
  }
}
