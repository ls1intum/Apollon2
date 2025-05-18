import { useDiagramStore, useMetadataStore } from "@/store"
import { ApollonMode } from "@/typings"
import { useShallow } from "zustand/shallow"

export const useHandleDelete = (elementId: string) => {
  const { nodes, edges, setNodesAndEdges } = useDiagramStore(
    useShallow((state) => ({
      nodes: state.nodes,
      edges: state.edges,
      setNodesAndEdges: state.setNodesAndEdges,
    }))
  )

  const { readonlyDiagram, diagramMode } = useMetadataStore(
    useShallow((state) => ({
      readonlyDiagram: state.readonly,
      diagramMode: state.mode,
    }))
  )

  const handleDelete = () => {
    if (
      readonlyDiagram ||
      diagramMode === ApollonMode.Assessment ||
      diagramMode === ApollonMode.Exporting
    )
      return
    const newNodes = nodes.filter((node) => node.id !== elementId)
    const newEdges = edges.filter((edge) => edge.id !== elementId)
    setNodesAndEdges(newNodes, newEdges)
  }

  return handleDelete
}
