import WebSocket, { WebSocketServer } from "ws"
import { IncomingMessage } from "http"
import { URL } from "url"

// Augment the WebSocket type to add custom fields like roomId
interface ExtendedWebSocket extends WebSocket {
  roomId?: string
}

export const startTestSocketServer = (): void => {
  const serverHost = process.env.HOST || "localhost"
  const wsServerPort = Number(process.env.WS_PORT) || 4444

  const wss = new WebSocketServer({
    port: wsServerPort,
    host: serverHost,
  })

  const rooms: Map<string, Set<ExtendedWebSocket>> = new Map()

  wss.on("error", (error: NodeJS.ErrnoException) => {
    console.error("WebSocket server error:", error)
    if (error.code === "EADDRINUSE") {
      console.error(
        `Port ${wsServerPort} is already in use. Please check if another instance is running.`
      )
    }
  })

  wss.on("connection", (ws: ExtendedWebSocket, request: IncomingMessage) => {
    const url = new URL(request.url || "", `http://${request.headers.host}`)
    const roomId = url.searchParams.get("roomId")

    if (!roomId) {
      ws.close(1008, "Missing roomId")
      return
    }

    // Assign client to room
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set())
    }
    rooms.get(roomId)!.add(ws)
    ws.roomId = roomId

    console.log("Client connected to room:", roomId)

    ws.on("message", (message: WebSocket.RawData) => {
      const clients = rooms.get(ws.roomId!)
      if (!clients) return

      let clientNumberMessageHasBeenSend = 0
      clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message)
          clientNumberMessageHasBeenSend++
        }
      })

      console.log(
        `Message sent to ${clientNumberMessageHasBeenSend} clients in room ${ws.roomId}`
      )
    })

    ws.on("close", () => {
      const clients = rooms.get(ws.roomId!)
      if (clients) {
        clients.delete(ws)
        if (clients.size === 0) rooms.delete(ws.roomId!)
      }
      console.log("Client disconnected from room:", ws.roomId)
    })

    ws.on("error", (error: Error) => {
      console.error("WebSocket error:", error)
    })
  })

  const address = wss.address()
  console.log("WebSocket address:", address)
  console.log(
    `Yjs WebSocket server running on ws://${serverHost}:${wsServerPort}`
  )
}
