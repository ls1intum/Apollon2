// LibraryView.tsx

import { Navbar } from "@/components"

import "@xyflow/react/dist/style.css"
import { Apollon2Provider } from "./contexts/Apollon2Context"

export function LibraryView() {
  return (
    <Apollon2Provider>
      <Navbar />
    </Apollon2Provider>
  )
}
