/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react"
import { useApollon2Context } from "@/contexts"
import { Apollon2 } from "@apollon2/library"
import { useParams, useSearchParams } from "react-router"
import { toast } from "react-toastify"
import { backendWSSUrl } from "@/constants"
import { DiagramView } from "@/types"

const mockFetchDiagramData = (diagramID: string): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Mock fetch completed for diagramID: ${diagramID}`)
      resolve({
        version: "apollon2",
        title: "Default Diagram",
        diagramType: "ClassDiagram",
        nodes: [],
        edges: [],
      })
    }, 2000)
  })
}

export const ApollonWithConnection: React.FC = () => {
  const { apollon2, setApollon2 } = useApollon2Context()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const { diagramID } = useParams()
  const [searchParams] = useSearchParams()
  const websocketRef = useRef<WebSocket | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  console.log("ApollonWithConnection diagramID", diagramID)
  console.log("ApollonWithConnection apollon2", apollon2)

  useEffect(() => {
    if (containerRef.current && diagramID) {
      let instance: Apollon2 | null = null
      const initializeApollon = async () => {
        try {
          const mockedDiagram = await mockFetchDiagramData(diagramID)

          console.log("Fetched diagram data:", mockedDiagram)

          instance = new Apollon2(containerRef.current!, {
            model: mockedDiagram,
          })
          setApollon2(instance)
          setIsLoading(false)
          const viewType = searchParams.get("view")
          const validViewTypes: string[] = [
            DiagramView.COLLABORATE,
            DiagramView.GIVE_FEEDBACK,
            DiagramView.SEE_FEEDBACK,
            DiagramView.EDIT,
          ]
          const isValidView = viewType && validViewTypes.includes(viewType)
          const makeConnection = isValidView
            ? viewType === DiagramView.COLLABORATE ||
              viewType === DiagramView.GIVE_FEEDBACK ||
              viewType === DiagramView.SEE_FEEDBACK
            : false

          if (makeConnection) {
            // Set up the WebSocket connection
            websocketRef.current = new WebSocket(
              `${backendWSSUrl}?diagramId=${diagramID}`
            )

            // Handle incoming Yjs updates
            websocketRef.current.onmessage = (event: MessageEvent<Blob>) => {
              event.data.arrayBuffer().then((buffer: ArrayBuffer) => {
                const data = new Uint8Array(buffer)
                instance?.receiveBroadcastedMessage(data)
              })
            }

            // Wait until socket is open before starting sync
            websocketRef.current.onopen = () => {
              instance?.sendBroadcastMessage((data) => {
                if (websocketRef.current?.readyState === WebSocket.OPEN) {
                  websocketRef.current.send(data)
                } else {
                  console.warn("Tried to send while WebSocket not open")
                }
              })
              websocketRef.current?.send(new Uint8Array([0])) // Init message
            }

            websocketRef.current.onerror = (err) => {
              console.error("WebSocket error", err)
              toast.error("WebSocket connection error")
            }

            websocketRef.current.onclose = (closeEnvt) => {
              console.warn("WebSocket closed, closeEnvt", closeEnvt)
            }
          }

          // Return cleanup function for Apollon2 and WebSocket
          return () => {
            console.log("Cleaning up ApollonWithConnection")
            if (instance) {
              instance.dispose() // Dispose Apollon2 instance
              instance = null // Clear reference
            }
            setApollon2(undefined) // Clear context
            // Clean up WebSocket
            if (
              websocketRef.current &&
              websocketRef.current.readyState === WebSocket.OPEN
            ) {
              console.log("Closing WebSocket connection")
              websocketRef.current.close()
              websocketRef.current = null
            }
          }
        } catch (error) {
          toast.error("Error loading diagram. Please try again.")
          console.error("Error setting up Apollon2:", error)
        }
      }

      initializeApollon()
    }
    // Implicitly return undefined if conditions are not met
  }, [diagramID, searchParams, setApollon2])

  return (
    <div className="flex  grow">
      {isLoading && (
        <div className="flex grow justify-center  items-center ">
          Preparing the diagram for collaboration...
        </div>
      )}

      <div className={isLoading ? "hidden" : "flex grow "} ref={containerRef} />
    </div>
  )
}
