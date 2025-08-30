const isDev = import.meta.env.DEV

export const backendURL =
  import.meta.env.VITE_BACKEND_URL || (isDev ? "" : "http://localhost:8000")

export const backendWSSUrl =
  import.meta.env.VITE_BACKEND_URL_WSS ||
  (isDev
    ? `${location.protocol === "https:" ? "wss:" : "ws:"}//${location.host}/ws`
    : "ws://localhost:4444")
