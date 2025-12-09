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
import {
  PlaygroundDefaultModel,
  playgroundModelId,
} from "@/constants/playgroundDefaultDiagram"
import {
  useExportAsSVG,
  useExportAsPNG,
  useExportAsJSON,
  useExportAsPDF,
} from "@/hooks"
import { FeedbackBoxes } from "@/components/FeedbackBoxes"
import { useShallow } from "zustand/shallow"
import { log } from "@/logger"
import { AssessmentDataBox } from "@/components/playground/AssessmentDataBox"

const UMLDiagramTypes = Object.values(UMLDiagramType)

export const ApollonPlayground: React.FC = () => {
  const { setEditor } = useEditorContext()
  const [assessmentSelectedElements, setAssessmentSelectedElements] = useState<
    string[]
  >([])
  const exportAsSvg = useExportAsSVG()
  const exportAsPNG = useExportAsPNG()
  const exportAsJSON = useExportAsJSON()
  const exportAsPDF = useExportAsPDF()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const diagram = usePersistenceModelStore(
    (store) => store.models[PlaygroundDefaultModel.id]
  )
  const { updateModel, setCurrentModelId } = usePersistenceModelStore(
    useShallow((store) => ({
      updateModel: store.updateModel,
      setCurrentModelId: store.setCurrentModelId,
    }))
  )

  const [apollonOptions, setApollonOptions] = useState<ApollonOptions>({
    mode: ApollonMode.Modelling,
    locale: Locale.en,
    readonly: false,
    debug: false,
  })

  useEffect(() => {
    setCurrentModelId(playgroundModelId)
  }, [])

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

      instance.subscribeToAssessmentSelection((selectedElements) => {
        setAssessmentSelectedElements(selectedElements)
      })

      setEditor(instance)

      return () => {
        log.debug("disposing instance")
        instance.destroy()
      }
    }
  }, [apollonOptions])

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flex: 1,
        height: "100%",
      }}
    >
      <div className="flex flex-col p-4 gap-2 overflow-scroll w-[300px]  bg-[var(--apollon2-background-variant)] text-[var(--apollon2-primary-contrast)]">
        <div>
          <label className="font-semibold ">Select Diagram Type</label>
          <select
            className="border-2 border-gray-400 p-1 rounded-md flex w-[200px]"
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
            className="border-2 border-gray-400 p-1 rounded-md flex w-[200px]"
            onChange={(e) => {
              const selectedLocale = e.target.value as Locale
              log.debug("DEBUG selectedLocale", selectedLocale)
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
            className="border-2 border-gray-400 p-1 rounded-md flex w-[200px] "
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
            <label className="font-semibold">Debug Mode for See feedback</label>
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

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={apollonOptions.scrollProtection}
            onChange={(event) => {
              setApollonOptions((prev) => ({
                ...prev!,
                scrollProtection: event.target.checked,
              }))
            }}
          />
          <label className="font-semibold">Scroll Protection</label>
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

        <AssessmentDataBox
          assessmentSelectedElements={assessmentSelectedElements}
        />
      </div>

      {/* When scroll protection is enabled, wrap in scrollable container with content above/below */}
      {apollonOptions.scrollProtection ? (
        <div
          key="scroll-protection-enabled"
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            overflow: "auto",
          }}
        >
          {/* Content above the editor */}
          <div
            style={{
              padding: "40px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              textAlign: "center",
              flexShrink: 0,
            }}
          >
            <h2
              style={{
                fontSize: "24px",
                fontWeight: 600,
                marginBottom: "16px",
              }}
            >
              📜 Scroll Protection Test Area
            </h2>
            <p
              style={{
                fontSize: "16px",
                opacity: 0.9,
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              Scroll down to see the Apollon editor. Try scrolling over the
              diagram area - you should see the overlay message. Use{" "}
              <kbd
                style={{
                  background: "rgba(255,255,255,0.2)",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  fontFamily: "inherit",
                }}
              >
                ⌘
              </kbd>{" "}
              + scroll (or{" "}
              <kbd
                style={{
                  background: "rgba(255,255,255,0.2)",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  fontFamily: "inherit",
                }}
              >
                Ctrl
              </kbd>{" "}
              on Windows) to zoom.
            </p>
          </div>

          {/* The Apollon Editor */}
          <div
            key="playground-with-scroll-protection"
            id="playground"
            style={{
              display: "flex",
              height: "500px",
              minHeight: "500px",
              flexShrink: 0,
            }}
            ref={containerRef}
          />

          {/* Content below the editor */}
          <div
            style={{
              padding: "60px 40px",
              background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
              color: "white",
              textAlign: "center",
              flexShrink: 0,
            }}
          >
            <h2
              style={{
                fontSize: "24px",
                fontWeight: 600,
                marginBottom: "16px",
              }}
            >
              ⬇️ More Content Below
            </h2>
            <p
              style={{
                fontSize: "16px",
                opacity: 0.9,
                maxWidth: "600px",
                margin: "0 auto 24px",
              }}
            >
              This section simulates additional page content below the embedded
              diagram. The scroll protection feature prevents accidental zoom
              when scrolling the page.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "20px",
                maxWidth: "800px",
                margin: "0 auto",
              }}
            >
              {["Feature 1", "Feature 2", "Feature 3"].map((feature) => (
                <div
                  key={feature}
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    padding: "24px",
                    borderRadius: "12px",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <h3 style={{ fontWeight: 600, marginBottom: "8px" }}>
                    {feature}
                  </h3>
                  <p style={{ fontSize: "14px", opacity: 0.85 }}>
                    Sample content to demonstrate a typical embedded diagram
                    scenario.
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Even more content for scrolling */}
          <div
            style={{
              padding: "80px 40px",
              background: "#1a1a2e",
              color: "white",
              textAlign: "center",
              flexShrink: 0,
            }}
          >
            <h2
              style={{
                fontSize: "24px",
                fontWeight: 600,
                marginBottom: "16px",
              }}
            >
              🎯 End of Page
            </h2>
            <p style={{ fontSize: "16px", opacity: 0.7 }}>
              You&apos;ve successfully scrolled past the diagram without
              accidentally zooming!
            </p>
          </div>
        </div>
      ) : (
        <div
          key="playground-normal"
          id="playground"
          style={{ display: "flex", flex: 1, height: "100%" }}
          ref={containerRef}
        />
      )}
    </div>
  )
}
