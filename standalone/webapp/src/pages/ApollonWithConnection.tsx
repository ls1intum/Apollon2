/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react"
import { useApollon2Context } from "@/contexts"
import {
  Apollon2,
  ApollonDiagram,
  ApollonMode,
  ApollonOptions,
} from "@apollon2/library"
import { useNavigate, useParams, useSearchParams } from "react-router"
import { toast } from "react-toastify"
import { backendURL, backendWSSUrl } from "@/constants"
import { DiagramView } from "@/types"

const fetchDiagramData = (diagramId: string): Promise<any> => {
  return fetch(`${backendURL}/api/${diagramId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (res.ok) {
      return res.json()
    } else {
      throw new Error("Failed to fetch diagram data")
    }
  })
}

const sendPutRequest = async (diagramId: string, data: ApollonDiagram) => {
  try {
    const response = await fetch(`${backendURL}/api/${diagramId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error("Failed to send PUT request")
    }
  } catch (error) {
    console.error("Error in PUT request:", error)
    toast.error("Failed to sync diagram data")
  }
}

export const ApollonWithConnection: React.FC = () => {
  const { diagramId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { setApollon2 } = useApollon2Context()
  const [isLoading, setIsLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const websocketRef = useRef<WebSocket | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null) // Ref to store interval ID
  const diagramIsUpdated = useRef(false)

  useEffect(() => {
    let instance: Apollon2 | null = null
    if (containerRef.current && diagramId) {
      const initializeApollon = async () => {
        try {
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

          if (!isValidView) {
            toast.error("Invalid view type")
            navigate("/")
            return
          }

          const diagram = await fetchDiagramData(diagramId)

          diagram.id = diagramId
          const editorOptions: ApollonOptions = {
            model: diagram,
          }

          if (viewType === DiagramView.GIVE_FEEDBACK) {
            editorOptions.mode = ApollonMode.Assessment
            editorOptions.readonly = false
          } else if (viewType === DiagramView.SEE_FEEDBACK) {
            editorOptions.mode = ApollonMode.Assessment
            editorOptions.readonly = true
          } else if (viewType === DiagramView.EDIT) {
            editorOptions.mode = ApollonMode.Modelling
            editorOptions.readonly = false
          } else {
            editorOptions.mode = ApollonMode.Modelling
            editorOptions.readonly = false
          }

          instance = new Apollon2(containerRef.current!, editorOptions)
          setApollon2(instance)
          setIsLoading(false)

          if (makeConnection) {
            // Set up the WebSocket connection
            websocketRef.current = new WebSocket(
              `${backendWSSUrl}?diagramId=${diagramId}`
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

            intervalRef.current = setInterval(() => {
              if (instance && diagramId && diagramIsUpdated.current) {
                const diagramData = instance.getDiagram()
                sendPutRequest(diagramId, diagramData)
                diagramIsUpdated.current = false
              }
            }, 5000)
          }

          instance.subscribeToModalNodeEdgeChange(() => {
            diagramIsUpdated.current = true
          })

          // Return cleanup function for Apollon2 and WebSocket
        } catch (error) {
          toast.error("Error loading diagram. Please try again.")
          navigate("/")
          console.error("Error setting up Apollon2:", error)
        }
      }

      initializeApollon()
    }

    return () => {
      setApollon2(undefined) // Clear context

      // Clear interval if it exists
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }

      // Clean up WebSocket
      if (
        websocketRef.current &&
        websocketRef.current.readyState === WebSocket.OPEN
      ) {
        console.log("Clearing WebSocket connection")
        websocketRef.current.close()
        websocketRef.current = null
      }

      if (instance) {
        instance.dispose()
        instance = null
      }
    }

    // Implicitly return undefined if conditions are not met
  }, [diagramId, searchParams, setApollon2])

  return (
    <div className="flex  grow">
      {isLoading && (
        <div className="flex grow justify-center  items-center ">
          Preparing the diagram for collaboration...
        </div>
      )}

      <div
        className={isLoading ? "invisible" : "flex grow "}
        ref={containerRef}
      />
    </div>
  )
}
