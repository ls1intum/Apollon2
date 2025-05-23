import React, { useEffect, useRef, useState } from "react"
import {
  ApollonEditor,
  ApollonMode,
  Locale,
  UMLDiagramType,
  ApollonOptions,
  UMLModel,
} from "@tumaet/apollon"
import { useEditorContext } from "@/contexts"
import { usePersistenceModelStore } from "@/stores/usePersistenceModelStore"
import { convertV3ToV4Forest } from "@/utils/apollonConverter"

import {
  useExportAsSVG,
  useExportAsPNG,
  useExportAsJSON,
  useExportAsPDF,
} from "@/hooks"

const UMLDiagramTypes = Object.values(UMLDiagramType)

const diagram = {
  id: "7a0d5f4d-d452-429b-9d41-7f1cf3ada657",
  model: {
    id: "7a0d5f4d-d452-429b-9d41-7f1cf3ada657",
    version: "4.0.0",
    title: "Class Diagram",
    type: "ClassDiagram",
    nodes: [
      {
        id: "ae42f760-b037-47a9-83f2-f8535f7adce6",
        type: "Class",
        position: { x: -460, y: -100 },
        width: 160,
        height: 110,
        data: {
          name: "Interface",
          stereotype: "Interface",
          attributes: [
            {
              id: "b377995a-db4e-472d-ba6b-cf3a90bc6fe6",
              name: "+ attribute: Type",
            },
          ],
          methods: [
            { id: "09054d50-4429-434f-8978-96c69802a8aa", name: "+ method()" },
          ],
        },
        measured: { width: 160, height: 110 },
      },
      {
        id: "c95faa5c-eb91-4538-8a7b-f6d89ee0097c",
        type: "Class",
        position: { x: -640, y: -220 },
        width: 160,
        height: 140,
        data: {
          name: "Enumeration",
          stereotype: "Enumeration",
          attributes: [
            { id: "ce4ac6f2-cd62-4340-95b1-26bd7243bd12", name: "Case 1" },
            { id: "bcbea417-6c22-44e1-a033-4a6af2a71c24", name: "Case 2" },
            { id: "2fa7e0db-1344-46d1-81f8-904e33737832", name: "Case 3" },
          ],
          methods: [],
        },
        measured: { width: 160, height: 140 },
      },
      {
        id: "cee1fa90-09dd-4bac-ba33-da88f834acc7",
        type: "Class",
        position: { x: -270, y: -40 },
        width: 160,
        height: 100,
        data: {
          name: "Class",
          attributes: [
            {
              id: "85e64809-b446-43f2-8c8d-a62ae425dcc8",
              name: "+ attribute: Type",
            },
          ],
          methods: [
            { id: "adcd0d72-8660-4dad-bfef-15b6730814c2", name: "+ method()" },
          ],
        },
        measured: { width: 160, height: 100 },
      },
      {
        id: "0503e2c5-d9c7-4dbd-9d19-1edb0f247841",
        type: "Class",
        position: { x: -610, y: -50 },
        width: 160,
        height: 110,
        data: {
          name: "Interface",
          stereotype: "Interface",
          attributes: [
            {
              id: "7993ebda-d0d1-4b58-bb00-32f4e439bddb",
              name: "+ attribute: Type",
            },
          ],
          methods: [
            { id: "b43e5db8-0d06-4fbd-b307-5e51ad6ffb10", name: "+ method()" },
          ],
        },
        measured: { width: 160, height: 110 },
      },
      {
        id: "5866b474-5a8c-4b86-a3b8-1513bd7491cc",
        type: "Class",
        position: { x: -60, y: -280 },
        width: 160,
        height: 110,
        data: {
          name: "Interface",
          stereotype: "Interface",
          attributes: [
            {
              id: "74ef6999-8e62-4e58-9e12-1e2114c351d3",
              name: "+ attribute: Type",
            },
          ],
          methods: [
            { id: "afbf2b5c-d6da-4071-bf89-78f258e7dd2e", name: "+ method()" },
          ],
        },
        measured: { width: 160, height: 110 },
      },
      {
        id: "10a607c7-5187-465f-905a-46318c6b6d33",
        type: "Class",
        position: { x: -40, y: 50 },
        width: 160,
        height: 140,
        data: {
          name: "Enumeration",
          stereotype: "Enumeration",
          attributes: [
            { id: "0869b348-27bb-4d86-8e52-bb31341e2136", name: "Case 1" },
            { id: "64a75a54-e13b-4f0c-a337-10d28777409d", name: "Case 2" },
            { id: "0dcb16b1-2f4c-4df3-876a-181f5804b3a7", name: "Case 3" },
          ],
          methods: [],
        },
        measured: { width: 160, height: 140 },
      },
    ],
    edges: [],
    assessments: {},
  },
  lastModifiedAt: "2025-05-23T13:49:38.235Z",
}
export const ApollonPlayground: React.FC = () => {
  const { setEditor } = useEditorContext()
  const exportAsSvg = useExportAsSVG()
  const exportAsPNG = useExportAsPNG()
  const exportAsJSON = useExportAsJSON()
  const exportAsPDF = useExportAsPDF()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const updateModel = usePersistenceModelStore((store) => store.updateModel)
  const [convertedDiagram, setConvertedDiagram] = useState("")

  const [apollonOptions, setApollonOptions] = useState<ApollonOptions>({
    mode: ApollonMode.Modelling,
    locale: Locale.en,
    readonly: false,
    model: diagram.model as UMLModel,
  })

  useEffect(() => {
    if (containerRef.current) {
      const instance = new ApollonEditor(containerRef.current, apollonOptions)

      const subscriptionId = instance.subscribeToModelChange((model) => {
        updateModel(model)
      })

      setEditor(instance)

      return () => {
        console.log("disposing instance")
        instance.unsubscribeFromModelChange(subscriptionId)
        instance.dispose()
      }
    }
  }, [apollonOptions])

  return (
    <div className="flex flex-row grow ">
      <div className="flex flex-col p-4 gap-2 overflow-scroll max-w-[300px]">
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
              console.log("DEBUG selectedMode", selectedMode)
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

        <button
          onClick={() => {
            try {
              const parsedModel = JSON.parse(convertedDiagram)
              setApollonOptions((prev) => ({
                ...prev!,
                model: parsedModel.model,
              }))
            } catch (error) {
              console.error("Invalid JSON", error)
            }
          }}
          className="border p-1 rounded-sm"
        >
          Load Converted JSON
        </button>
        <textarea
          className="border-2 border-gray-400 p-1 rounded-md flex w-[200px] bg-white"
          placeholder="JSON"
          onChange={(e) => {
            const json = e.target.value
            try {
              const parsedModel = JSON.parse(json)
              const convertedModel = convertV3ToV4Forest(parsedModel)
              setConvertedDiagram(JSON.stringify(convertedModel, null, 2))
            } catch (error) {
              console.error("Invalid JSON", error)
            }
          }}
        />

        <textarea
          className="border-2 border-gray-400 p-1 rounded-md flex w-[200px] bg-white"
          placeholder="Converted JSON"
          value={convertedDiagram}
          readOnly
        />
      </div>

      <div
        id="playground"
        className="flex grow min-h-20 min-w-20 "
        ref={containerRef}
      />
    </div>
  )
}
