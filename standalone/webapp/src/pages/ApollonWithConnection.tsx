import React, { useEffect, useRef } from "react"
import { useApollon2Context } from "@/contexts"
import { Apollon2 } from "@apollon2/library"
import { useParams } from "react-router"

import { toast } from "react-toastify"
import { backendWSSUrl } from "@/constants"

export const ApollonWithConnection: React.FC = () => {
  const { apollon2, setApollon2 } = useApollon2Context()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const { diagramID } = useParams()

  useEffect(() => {
    const handleSetup = async () => {
      if (containerRef.current && !apollon2 && diagramID) {
        try {
          console.log("Creating WebSocket connection")
          // const ws = new WebSocket(`${backendWSSUrl}+/${diagramID}`)
          const ws = new WebSocket(backendWSSUrl)

          const instance = new Apollon2(containerRef.current)
          setApollon2(instance)

          // Handle incoming Yjs updates
          ws.onmessage = (event: MessageEvent<Blob>) => {
            event.data.arrayBuffer().then((buffer: ArrayBuffer) => {
              const data = new Uint8Array(buffer)
              instance.receiveBroadcastedMessage(data)
            })
          }

          // Wait until socket is open before starting sync
          ws.onopen = () => {
            console.log("WebSocket connected")

            // Set send function AFTER open
            instance.sendBroadcastMessage((data) => {
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(data)
              } else {
                console.warn("Tried to send while WebSocket not open")
              }
            })

            ws.send(new Uint8Array([0])) // your init message
            instance.startSync()
          }

          ws.onerror = (err) => {
            console.error("WebSocket error", err)
            toast.error("WebSocket connection error")
          }

          ws.onclose = () => {
            console.warn("WebSocket closed")
          }
        } catch (error) {
          toast.error("Error loading diagram. Please try again.")
          console.error("Error setting up Apollon2:", error)
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
