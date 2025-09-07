import React, { useState } from "react"
import { DividerLine, TextField, Typography } from "@/components/ui"
import { PaintRollerIcon } from "@/components/Icon/PaintRollerIcon"
import { CrossIcon } from "@/components/Icon"
import { ColorButton, ColorButtons } from "./ColorButtons"
import { DefaultNodeProps } from "@/types"

interface NodeStyleEditorProps {
  nodeData: DefaultNodeProps
  handleDataFieldUpdate: (key: keyof DefaultNodeProps, value: string) => void
  sideElements?: React.ReactNode[]
  inputPlaceholder?: string
}

// Centralized styles for reusability
const styles = {
  container: {
    display: "flex",
    flexDirection: "row" as const,
    alignItems: "center",
    gap: "5px",
    flex: 1,
  },
  colorPanel: {
    display: "flex",
    flexDirection: "column" as const,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "var(--apollon2-background)",
    border: "1px solid var(--apollon2-gray)",
    paddingBottom: 10,
  },
  colorOption: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  colorPickerHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: 16,
  },
  resetButton: {
    marginTop: 12,
    padding: "6px 12px",
    backgroundColor: "var(--apollon2-background)",
    color: "var(--apollon2-primary-contrast)",
    border: "1px solid var(--apollon2-gray)",
    cursor: "pointer",
    borderRadius: 4,
    width: "fit-content",
  },
}

// Mapping for color fields
const colorFields: { key: keyof DefaultNodeProps; label: string }[] = [
  { key: "fillColor", label: "Fill Color" },
  { key: "strokeColor", label: "Stroke Color" },
  { key: "textColor", label: "Text Color" },
]

// Subcomponent for rendering a single color option
const ColorOption: React.FC<{
  label: string
  color: string | undefined
  onSelect: () => void
}> = ({ label, color, onSelect }) => (
  <div style={styles.colorOption}>
    <Typography>{label}</Typography>
    <ColorButton onSelect={onSelect} color={color || "#000000"} />
  </div>
)

export const StyleEditor: React.FC<NodeStyleEditorProps> = ({
  nodeData,
  handleDataFieldUpdate,
  sideElements = [],
  inputPlaceholder = "Enter node name",
}) => {
  const [paintOpen, setPaintOpen] = useState(false)
  const [activeColorField, setActiveColorField] = useState<
    keyof DefaultNodeProps | null
  >(null)

  const toggleColorField = (key: keyof DefaultNodeProps) => {
    setActiveColorField((prev) => (prev === key ? null : key))
  }

  return (
    <>
      <div style={styles.container}>
        <TextField
          id="outlined-basic"
          variant="outlined"
          onChange={(event) =>
            handleDataFieldUpdate("name", event.target.value)
          }
          fullWidth
          size="small"
          value={nodeData.name}
          placeholder={inputPlaceholder}
        />
        <PaintRollerIcon
          onClick={() => setPaintOpen(!paintOpen)}
          aria-label="Toggle color settings"
        />
        {sideElements}
      </div>

      {paintOpen && (
        <div style={styles.colorPanel}>
          {!activeColorField ? (
            colorFields.map(({ key, label }) => (
              <>
                <ColorOption
                  key={key}
                  label={label}
                  color={nodeData[key]}
                  onSelect={() => toggleColorField(key)}
                />
                {key !== colorFields[colorFields.length - 1].key && (
                  <DividerLine backgroundColor="var(--apollon2-gray)" />
                )}
              </>
            ))
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div style={styles.colorPickerHeader}>
                <Typography>
                  {colorFields.find((f) => f.key === activeColorField)?.label}
                </Typography>
                <CrossIcon
                  fill="var(--apollon2-primary-contrast)"
                  onClick={() => setActiveColorField(null)}
                />
              </div>
              <ColorButtons
                onSelect={(color) =>
                  handleDataFieldUpdate(activeColorField, color)
                }
              />
              <button
                style={styles.resetButton}
                onClick={() => handleDataFieldUpdate(activeColorField, "")}
              >
                Reset
              </button>
            </div>
          )}
        </div>
      )}
    </>
  )
}
