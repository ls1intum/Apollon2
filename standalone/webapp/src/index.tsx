import { createRoot } from "react-dom/client"
import App from "./App.tsx"
import { useThemeStore } from "./stores/useThemeStore.tsx"
import { log } from "./logger"

const rootElement = document.getElementById("root")

useThemeStore.getState().initializeTheme()

if (rootElement) {
  createRoot(rootElement).render(<App />)
} else {
  log.error("Root element not found")
}
