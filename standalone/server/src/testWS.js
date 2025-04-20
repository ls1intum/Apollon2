const WebSocket = require("ws")

export const startTestSocketServer = () => {
  const serverHost = process.env.HOST || "localhost"
  const wsServerPort = Number(process.env.WS_PORT) || 4444
  const wss = new WebSocket.Server({
    port: wsServerPort,
    host: serverHost,
  })
  const clients = new Set()

  wss.on("connection", (ws, req) => {
    clients.add(ws)

    ws.on("message", (message) => {
      console.log("Received message, size:", message.length)
      try {
        const data = Buffer.isBuffer(message) ? message : Buffer.from(message)
        let broadcastCount = 0
        clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN && client !== ws) {
            client.send(data, { binary: true })
            broadcastCount++
          }
        })
        console.log(`Broadcasted to ${broadcastCount} clients`)
      } catch (err) {
        console.error("Error broadcasting message:", err)
      }
    })

    ws.on("close", () => {
      console.log("Client disconnected")
      clients.delete(ws)
    })

    ws.on("error", (error) => {
      console.error("WebSocket error:", error)
    })
  })

  console.log(
    `Yjs WebSocket server running on ws://${serverHost}/${wsServerPort}`
  )
}
