import { BrowserRouter, Route, Routes } from "react-router"
import { AppProviders } from "./AppProviders"
import { Navbar } from "./components"
import "@xyflow/react/dist/style.css"
import { Apollon, ApollonWithCollaboration, ErrorPage } from "@/pages"

function App() {
  return (
    <AppProviders>
      <div
        style={{ display: "flex", flexDirection: "column", height: "100vh" }}
      >
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
      </div>
    </AppProviders>
  )
}

export default App
