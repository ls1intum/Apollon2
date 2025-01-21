import { useApollon2Context } from "@/contexts"

export const useExportDiagramAsJson = () => {
  const { apollon2, diagramName } = useApollon2Context()

  const exportDiagramAsJson = () => {
    const data = {
      version: "apollon2",
      title: diagramName,
      nodes: apollon2?.getNodes(),
      edges: apollon2?.getEdges(),
    }
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(data)
    )}`
    const link = document.createElement("a")
    link.href = jsonString
    link.download = `${diagramName}.json`

    link.click()
  }

  return { exportDiagramAsJson }
}
