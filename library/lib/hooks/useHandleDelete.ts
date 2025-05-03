import { useDiagramStore, useMetadataStore } from "@/store"
import { useShallow } from "zustand/shallow"

export const useHandleDelete = (elementId: string) => {
  const { nodes, edges, setNodesAndEdges } = useDiagramStore(
    useShallow((state) => ({
      nodes: state.nodes,
      edges: state.edges,
      setNodesAndEdges: state.setNodesAndEdges,
    }))
  )
  const { readonlyDiagram } = useMetadataStore(
    useShallow((state) => ({
      readonlyDiagram: state.readonly,
    }))
  )

  const handleDelete = () => {
    if (readonlyDiagram) return
    const newNodes = nodes.filter((node) => node.id !== elementId)
    const newEdges = edges.filter((edge) => edge.id !== elementId)
    setNodesAndEdges(newNodes, newEdges)
  }

  return handleDelete
}
