import { useDiagramStore } from "@/store"
import { useShallow } from "zustand/shallow"
import { usePopoverStore } from "@/store/context"

export const useGoToNextAssessment = (elementId: string) => {
  const { nodes, edges, setInteractiveElementId } = useDiagramStore(
    useShallow((state) => ({
      nodes: state.nodes,
      edges: state.edges,
      setInteractiveElementId: state.setInteractiveElementId,
    }))
  )
  const setPopOverElementId = usePopoverStore(
    useShallow((state) => state.setPopOverElementId)
  )

  const handleGoToNextAssessment = () => {
    const elements = [...nodes, ...edges]
    const currentIndex = elements.findIndex((el) => el.id === elementId)
    const totalElements = elements.length
    const nextIndex = (currentIndex + 1) % totalElements
    const nextElement = elements[nextIndex]
    setInteractiveElementId(nextElement.id)
    setPopOverElementId(nextElement.id)
  }

  return handleGoToNextAssessment
}
