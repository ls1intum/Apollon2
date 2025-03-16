import { BrowserRouter, Route, Routes } from "react-router"
import { AppProviders } from "./AppProviders"
import { Navbar } from "./components"
import "@xyflow/react/dist/style.css"
import { Apollon, ApollonWithCollaboration, ErrorPage } from "@/pages"
import { SafeArea } from "capacitor-plugin-safe-area"
import "./webapp.css"

// To set the safe area insets as for mobile devices
SafeArea.getSafeAreaInsets().then(
  ({ insets: { top, bottom, left, right } }) => {
    document.documentElement.style.setProperty(
      "--safe-area-inset-top",
      `${top}px`
    )
    document.documentElement.style.setProperty(
      "--safe-area-inset-bottom",
      `${bottom}px`
    )
    document.documentElement.style.setProperty(
      "--safe-area-inset-left",
      `${left}px`
    )
    document.documentElement.style.setProperty(
      "--safe-area-inset-right",
      `${right}px`
    )
  }
)

function App() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <AppProviders>
        <Navbar />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Apollon />} />
            <Route
              path="/diagram/:diagramId"
              element={<ApollonWithCollaboration />}
            />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </BrowserRouter>
      </AppProviders>
    </div>
  )
}

export default App
