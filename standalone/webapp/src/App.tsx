import { BrowserRouter, Route, Routes } from "react-router"
import { LibraryView } from "./LibraryView"

function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <BrowserRouter>
        <Routes>
          <Route path=":diagramId" element={<LibraryView />} />
          <Route path="/" element={<LibraryView />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
