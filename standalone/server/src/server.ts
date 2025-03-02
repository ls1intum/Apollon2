import { WebSocket, WebSocketServer } from "ws"
import http, { IncomingMessage } from "http"
import * as map from "lib0/map"

const wsReadyStateConnecting = WebSocket.CONNECTING
const wsReadyStateOpen = WebSocket.OPEN

const pingTimeout = 30000

const port = process.env.PORT || 4444
const wss = new WebSocketServer({ noServer: true })

const server = http.createServer((request, response) => {
  response.writeHead(200, { "Content-Type": "text/plain" })
  response.end("okay")
})

// Define message structure
interface Message {
  type: string
  topics?: string[]
  topic?: string
  clients?: number
}

// Map of topics to their subscribers
const topics = new Map<string, Set<WebSocket>>()

/**
 * Send a message to a connection.
 * Closes the connection if it's not in a valid state.
 */
const send = (conn: WebSocket, message: Message): void => {
  if (
    conn.readyState !== wsReadyStateConnecting &&
    conn.readyState !== wsReadyStateOpen
  ) {
    conn.close()
    return
  }
  try {
    conn.send(JSON.stringify(message))
  } catch (e) {
    console.error("Error sending message:", e)
    conn.close()
  }
}

/**
 * Setup a new WebSocket connection.
 */
const onConnection = (conn: WebSocket): void => {
  const subscribedTopics = new Set<string>()
  let closed = false
  let pongReceived = true

  const pingInterval = setInterval(() => {
    if (!pongReceived) {
      conn.close()
      clearInterval(pingInterval)
    } else {
      pongReceived = false
      try {
        conn.ping()
      } catch (e) {
        console.error("Error sending message:", e)
        conn.close()
      }
    }
  }, pingTimeout)

  conn.on("pong", () => {
    pongReceived = true
  })

  conn.on("close", () => {
    subscribedTopics.forEach((topicName) => {
      const subs = topics.get(topicName)
      if (subs) {
        subs.delete(conn)
        if (subs.size === 0) {
          topics.delete(topicName)
        }
      }
    })
    subscribedTopics.clear()
    closed = true
  })

  conn.on("message", (data: string | Buffer) => {
    let message: Message
    try {
      message = JSON.parse(data.toString())
    } catch {
      console.error("Invalid message format:", data.toString())
      return
    }

    if (message && message.type && !closed) {
      switch (message.type) {
        case "subscribe":
          ;(message.topics || []).forEach((topicName) => {
            if (typeof topicName === "string") {
              const topic = map.setIfUndefined(
                topics,
                topicName,
                () => new Set<WebSocket>()
              )
              topic.add(conn)
              subscribedTopics.add(topicName)
            }
          })
          break
        case "unsubscribe":
          ;(message.topics || []).forEach((topicName) => {
            const subs = topics.get(topicName)
            if (subs) {
              subs.delete(conn)
            }
          })
          break
        case "publish":
          if (message.topic) {
            const receivers = topics.get(message.topic)
            if (receivers) {
              message.clients = receivers.size
              receivers.forEach((receiver) => send(receiver, message))
            }
          }
          break
        case "ping":
          send(conn, { type: "pong" })
          break
        default:
          console.error("Unknown message type:", message.type)
      }
    }
  })
}

wss.on("connection", onConnection)

server.on("upgrade", (request: IncomingMessage, socket, head) => {
  const handleAuth = (ws: WebSocket): void => {
    wss.emit("connection", ws, request)
  }
  wss.handleUpgrade(request, socket, head, handleAuth)
})

server.listen(port, () => {
  console.log("Signaling server running on localhost:", port)
})
