import * as Y from "yjs"
import { WebsocketProvider } from "y-websocket"

const ydoc = new Y.Doc()
const wsProvider = new WebsocketProvider(
  "ws://localhost:4444",
  "my-roomname",
  ydoc
)

wsProvider.on("status", (event) => {
  console.log(event.status) // logs "connected" or "disconnected"
})

export default ydoc
