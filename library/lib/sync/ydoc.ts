import { Doc } from "yjs"
// For this example we use the WebrtcProvider to synchronize the document
// between multiple clients. Other providers are available.
// You can find a list here: https://docs.yjs.dev/ecosystem/connection-provider
import { WebrtcProvider } from "y-webrtc"

const ydoc = new Doc()

export const provider = new WebrtcProvider("REACTFLOW-COLLAB-EXAMPLE", ydoc, {
  // Please replace this with your own signaling server.
  // We are only hosting a very small and limited instance.
  // Head over to https://github.com/yjs/y-webrtc for more information
  // on how to set up your own signaling server.
  // signaling: ['wss://yjs-webrtc-signaling.fly.dev'],
  signaling: ["ws://localhost:4444"],
  // signaling: ['wss://egenerse-apollon2-server-latest.onrender.com'],
})

export default ydoc
