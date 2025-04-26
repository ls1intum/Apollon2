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
        nodes: [
          {
            id: "0cc72deb-3e35-43ce-9cc1-25b533f7ffc6",
            width: 160,
            height: 100,
            type: "class",
            position: { x: 130, y: 170 },
            data: {
              name: "Class",
              methods: [],
              attributes: [],
            },
            measured: { width: 160, height: 100 },
            selected: false,
          },
          {
            id: "a7e21676-cbd3-4a1a-8a0a-c9fc25a92685",
            width: 160,
            height: 120,
            type: "package",
            position: { x: 660, y: 270 },
            data: { name: "Package" },
            measured: { width: 160, height: 120 },
            selected: false,
            dragging: false,
          },
        ],
        edges: [
          {
            id: "aac54709-d524-4b47-a12d-dd614616da3c",
            source: "0cc72deb-3e35-43ce-9cc1-25b533f7ffc6",
            target: "a7e21676-cbd3-4a1a-8a0a-c9fc25a92685",
            type: "ClassUnidirectional",
            sourceHandle: "right",
            targetHandle: "left-bottom",
            selected: false,
            data: { sourceMultiplicity: "2" },
          },
        ],
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
