import { createRoot } from "react-dom/client"
import App from "./App.tsx"
import { useThemeStore } from "./stores/useThemeStore.tsx"

const rootElement = document.getElementById("root")

useThemeStore.getState().initializeTheme()

if (rootElement) {
  createRoot(rootElement).render(<App />)
} else {
  console.error("Root element not found")
}
