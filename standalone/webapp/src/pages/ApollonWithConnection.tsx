import React, { useEffect, useRef } from "react"
import { useApollon2Context } from "@/contexts"
import { Apollon2, DiagramType } from "@apollon2/library"
import { useParams, useSearchParams } from "react-router"
import { ApollonOptions } from "@apollon2/library/dist/types/EditorOptions"
import { DiagramView } from "@/types"
import { toast } from "react-toastify"
import { backendURL, backendWSSUrl } from "@/constants"

const fetchDiagram = async (diagramID: string) => {
  const response = await fetch(`${backendURL}/api/${diagramID}`)
  if (!response.ok) {
    throw new Error("Failed to fetch diagram")
  }
  const data = await response.json()
  return data
}

export const ApollonWithConnection: React.FC = () => {
  const { apollon2, setApollon2 } = useApollon2Context()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const { diagramID } = useParams()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const handleSetup = async () => {
      if (containerRef.current && !apollon2 && diagramID) {
        try {
          let instance: Apollon2
          const viewType = searchParams.get("view")
          const validViewTypes: DiagramView[] = [
            DiagramView.COLLABORATE,
            DiagramView.GIVE_FEEDBACK,
            DiagramView.SEE_FEEDBACK,
            DiagramView.EDIT,
          ]
          const isValidView =
            viewType && validViewTypes.includes(viewType as DiagramView)
          const makeConnection = isValidView
            ? viewType === DiagramView.COLLABORATE ||
              viewType === DiagramView.GIVE_FEEDBACK ||
              viewType === DiagramView.SEE_FEEDBACK
            : false

          if (makeConnection) {
            instance = new Apollon2(containerRef.current)
            instance.makeWebsocketConnection(backendWSSUrl, diagramID)
            setApollon2(instance)

            return
          }

          const { data } = await fetchDiagram(diagramID)
          const nodes = data.nodes
          const edges = data.edges
          const metadata = data.metadata
          const diagramName = metadata.diagramName || "Untitled Diagram"
          const diagramType = metadata.diagramType || DiagramType.ClassDiagram

          const editorOptions: ApollonOptions = {
            model: {
              name: diagramName,
              id: diagramID,
              type: diagramType,
              nodes: nodes,
              edges: edges,
            },
          }

          instance = new Apollon2(containerRef.current, editorOptions)
          setApollon2(instance)
        } catch (error) {
          toast.error(
            "Error fetching diagram. Please check the diagram ID and try again."
          )
          console.error("Error fetching diagram:", error)
        }
      }
    }
    handleSetup()

    return () => {
      if (apollon2) {
        console.log("Disposing Apollon2")
        apollon2.dispose()
        setApollon2(undefined)
      }
    }
  }, [apollon2])

  return <div style={{ flex: 1 }} ref={containerRef} />
}
