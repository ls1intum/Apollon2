import React, { useEffect, useRef, useState } from "react"
import {
  ApollonEditor,
  ApollonMode,
  Locale,
  UMLDiagramType,
  ApollonOptions,
} from "@tumaet/apollon"
import { useApollon2Context } from "@/contexts"

const UMLDiagramTypes = Object.values(UMLDiagramType)

export const ApollonPlayground: React.FC = () => {
  const { setApollon2 } = useApollon2Context()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [apollonOptions, setApollonOptions] = useState<ApollonOptions>({
    mode: ApollonMode.Modelling,
    locale: Locale.en,
    readonly: false,
    model: {
      version: "4.0.0",
      id: Math.random().toString(36).substring(2, 15),
      type: UMLDiagramType.ClassDiagram,
      assessments: {},
      edges: [],
      nodes: [],
      title: "Class Diagram",
    },
  })

  useEffect(() => {
    if (containerRef.current) {
      const instance = new ApollonEditor(containerRef.current, apollonOptions)
      setApollon2(instance)

      return () => {
        console.log("disposing instance")
        instance.dispose()
      }
    }
  }, [apollonOptions])

  return (
    <div className="flex flex-row grow">
      <div className="flex flex-col p-4 gap-2">
        <div>
          <label className="font-semibold ">Select Diagram Type</label>
          <select
            className="border-2 border-gray-400 p-1 rounded-md flex w-[200px] bg-white"
            onChange={(e) => {
              const selectedType = e.target.value as UMLDiagramType

              setApollonOptions((prev) => ({
                ...prev!,
                model: {
                  ...prev.model!,
                  type: selectedType,
                },
              }))
            }}
          >
            {UMLDiagramTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-semibold ">Language</label>
          <select
            className="border-2 border-gray-400 p-1 rounded-md flex w-[200px] bg-white"
            onChange={(e) => {
              const selectedLocale = e.target.value as Locale
              console.log("selected loacale", selectedLocale)
            }}
          >
            <option value={Locale.en}>English</option>
            <option value={Locale.de}>German</option>
          </select>
        </div>
        <div>
          <label className="font-semibold ">Mode</label>
          <select
            value={apollonOptions.mode}
            className="border-2 border-gray-400 p-1 rounded-md flex w-[200px] bg-white"
            onChange={(e) => {
              const selectedMode = e.target.value as ApollonMode
              setApollonOptions((prev) => ({
                ...prev!,
                mode: selectedMode,
              }))
              console.log("selected selectedMode", selectedMode)
            }}
          >
            <option value={ApollonMode.Assessment}>Assessment</option>
            <option value={ApollonMode.Exporting}>Exporting</option>
            <option value={ApollonMode.Modelling}>Modelling</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={apollonOptions.readonly}
            onChange={(event) => {
              setApollonOptions((prev) => ({
                ...prev!,
                readonly: event.target.checked,
              }))
            }}
          />
          <label className="font-semibold ">Readonly</label>
        </div>
      </div>

      <div className="flex grow min-h-20 min-w-20 " ref={containerRef} />
    </div>
  )
}
