import { usePersistenceModelStore } from "@/stores/usePersistenceModelStore"
import { MenuItem } from "@mui/material"
import React, { useRef } from "react"
import { useNavigate } from "react-router"

export const JsonFileImportButton: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const createModel = usePersistenceModelStore((state) => state.createModel)
  const navigate = useNavigate()

  // handleFileChange will be when user selects a file
  // data in the file will be processed by handleFileChange function
  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  // This function will be called when the user selects a file
  // It reads the file and processes the JSON data
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const timeStapToCreate = new Date().getTime()
        const json = JSON.parse(e.target?.result as string)
        createModel(json.model)
        navigate("..", {
          relative: "route",
          replace: true,
          state: { timeStapToCreate },
        }) // Navigate to the parent route after loading the model
      } catch (error) {
        console.error("Invalid JSON file", error)
      }
    }
    reader.readAsText(file)

    // Reset input so selecting the same file again will trigger the event
    event.target.value = ""
  }

  return (
    <div>
      <MenuItem onClick={handleButtonClick}>Import</MenuItem>
      <input
        type="file"
        accept=".json,application/json"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  )
}
