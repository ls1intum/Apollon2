import WebSocket, { WebSocketServer } from "ws"
import { IncomingMessage } from "http"
import { URL } from "url"

interface ExtendedWebSocket extends WebSocket {
  diagramId?: string
}

export const startSocketServer = (): void => {
  const serverHost = process.env.HOST || "localhost"
  const wsServerPort = Number(process.env.WS_PORT) || 4444

  const wss = new WebSocketServer({
    port: wsServerPort,
    host: serverHost,
  })

  const diagrams: Map<string, Set<ExtendedWebSocket>> = new Map()

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
    const diagramId = url.searchParams.get("diagramId")

    if (!diagramId) {
      ws.close(1008, "Missing diagramId")
      return
    }

    // Assign client to room
    if (!diagrams.has(diagramId)) {
      diagrams.set(diagramId, new Set())
    }
    diagrams.get(diagramId)!.add(ws)
    ws.diagramId = diagramId

    ws.on("message", (message: WebSocket.RawData) => {
      const clients = diagrams.get(ws.diagramId!)

      if (!clients) return

      let count = 0
      clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message)
          count++
        }
      })

      console.log(`Message sent to ${count} clients in diagram ${ws.diagramId}`)
    })

    ws.on("close", () => {
      const clients = diagrams.get(ws.diagramId!)
      if (clients) {
        clients.delete(ws)
        if (clients.size === 0) diagrams.delete(ws.diagramId!)
      }
    })

    ws.on("error", (error: Error) => {
      console.error("WebSocket error:", error)
    })
  })

  console.log(
    `Relay websocket server running on ws://${serverHost}:${wsServerPort}`
  )
}
