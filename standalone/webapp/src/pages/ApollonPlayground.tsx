import React, { useEffect, useRef, useState } from "react"
import {
  ApollonEditor,
  ApollonMode,
  Locale,
  UMLDiagramType,
  ApollonOptions,
} from "@tumaet/apollon"
import { useEditorContext } from "@/contexts"
import { usePersistenceModelStore } from "@/stores/usePersistenceModelStore"
import { PlaygroundDefaultModel } from "@/constants/playgroundDefaultDiagram"
import {
  useExportAsSVG,
  useExportAsPNG,
  useExportAsJSON,
  useExportAsPDF,
} from "@/hooks"
import { FeedbackBoxes } from "@/components/FeedbackBoxes"

const UMLDiagramTypes = Object.values(UMLDiagramType)

export const ApollonPlayground: React.FC = () => {
  const { setEditor } = useEditorContext()
  const exportAsSvg = useExportAsSVG()
  const exportAsPNG = useExportAsPNG()
  const exportAsJSON = useExportAsJSON()
  const exportAsPDF = useExportAsPDF()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const diagram = usePersistenceModelStore(
    (store) => store.models[PlaygroundDefaultModel.id]
  )
  const updateModel = usePersistenceModelStore((store) => store.updateModel)

  const [apollonOptions, setApollonOptions] = useState<ApollonOptions>({
    mode: ApollonMode.Modelling,
    locale: Locale.en,
    readonly: false,
    debug: false,
  })

  useEffect(() => {
    if (containerRef.current) {
      const createApollonOptions: ApollonOptions = {
        ...apollonOptions,
        model: diagram.model,
      }
      const instance = new ApollonEditor(
        containerRef.current,
        createApollonOptions
      )

      instance.subscribeToModelChange((model) => {
        updateModel(model)
      })

      setEditor(instance)

      return () => {
        console.log("disposing instance")
        instance.destroy()
      }
    }
  }, [apollonOptions])

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexGrow: 1,
        height: "100%",
      }}
    >
      <div className="flex flex-col p-4 gap-2 overflow-scroll max-w-[300px]">
        <div>
          <label className="font-semibold ">Select Diagram Type</label>
          <select
            className="border-2 border-gray-400 p-1 rounded-md flex w-[200px] bg-white"
            onChange={(e) => {
              const selectedType = e.target.value as UMLDiagramType
              const newModel = {
                ...diagram.model,
                type: selectedType,
              }
              setApollonOptions((prev) => ({
                ...prev,
                type: selectedType,
                model: newModel,
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
              console.log("DEBUG selectedLocale", selectedLocale)
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
            }}
          >
            <option value={ApollonMode.Assessment}>Assessment</option>
            <option value={ApollonMode.Exporting}>Exporting</option>
            <option value={ApollonMode.Modelling}>Modelling</option>
          </select>
        </div>

        {apollonOptions.mode === ApollonMode.Assessment && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={apollonOptions.debug}
              onChange={(event) => {
                setApollonOptions((prev) => ({
                  ...prev!,
                  debug: event.target.checked,
                }))
              }}
            />
            <label className="font-semibold">
              Debug Mode for Give feedback
            </label>
          </div>
        )}

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
          <label className="font-semibold">Readonly</label>
        </div>

        {apollonOptions.mode === ApollonMode.Assessment &&
          !apollonOptions.readonly && <FeedbackBoxes />}

        <button onClick={exportAsSvg} className="border p-1 rounded-sm">
          Export as SVG
        </button>
        <button
          onClick={() => exportAsPNG({ setWhiteBackground: true })}
          className="border p-1 rounded-sm"
        >
          Export as PNG(White Background)
        </button>
        <button
          onClick={() => exportAsPNG({ setWhiteBackground: false })}
          className="border p-1 rounded-sm"
        >
          Export as PNG
        </button>
        <button onClick={exportAsJSON} className="border p-1 rounded-sm">
          Export as JSON
        </button>
        <button onClick={exportAsPDF} className="border p-1 rounded-sm">
          Export as PDF
        </button>
      </div>

      <div
        id="playground"
        style={{ display: "flex", flex: 1, height: "100%" }}
        ref={containerRef}
      />
    </div>
  )
}
