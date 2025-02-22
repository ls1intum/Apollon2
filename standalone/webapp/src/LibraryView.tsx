import React from "react"
import { Navbar } from "@/components"
// import "@xyflow/react/dist/style.css"
import { AppProviders } from "./AppProviders"
import "@xyflow/react/dist/base.css"

export const LibraryView: React.FC = () => {
  return (
    <AppProviders>
      <Navbar />
    </AppProviders>
  )
}
