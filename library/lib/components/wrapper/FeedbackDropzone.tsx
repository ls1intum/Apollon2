import { useDropFeedback } from "@/hooks/useDropFeedback"
import { useMetadataStore } from "@/store"
import { ApollonMode } from "@/typings"
import React, { useState } from "react"
import { useShallow } from "zustand/shallow"

interface Props {
  children: React.ReactNode
  elementId: string
  elementType?: string
  asElement?: "g" | "div" | "path"
  className?: string
}

export const FeedbackDropzone: React.FC<Props> = ({
  children,
  elementId,
  elementType,
  asElement = "g",
  className,
}) => {
  const { mode, readonly } = useMetadataStore(
    useShallow((store) => ({
      mode: store.mode,
      readonly: store.readonly,
    }))
  )
  const [isDragOver, setIsDragOver] = useState(false)
  const onDropHandle = useDropFeedback({ elementId, elementType })

  const canDropFeedback = mode === ApollonMode.Assessment && !readonly

  if (!canDropFeedback) return <>{children}</>

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()

    // Only set dragOver for the topmost element (don't propagate to parents)
    e.stopPropagation()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()

    // Stop propagation so nested elements don't also show as drag targets
    e.stopPropagation()
    e.dataTransfer.dropEffect = "move"

    // Ensure this element stays highlighted when dragging over it
    if (!isDragOver) {
      setIsDragOver(true)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()

    // Stop propagation so only the topmost element handles the drop
    e.stopPropagation()
    setIsDragOver(false)
    onDropHandle(e as React.DragEvent<HTMLDivElement | SVGGElement>)
  }

  const getHoverStyle = () => {
    if (isDragOver) {
      if (asElement === "div") {
        return {
          outline: "3px solid #0064ff66",
        }
      }
      if (asElement === "path") {
        return {
          stroke: "#0064ff",
        }
      }

      return {
        outline: "3px solid #0064ff66",
      }
    }
  }

  const hoverStyle = getHoverStyle()

  if (asElement === "div") {
    return (
      <div
        id={elementId}
        onDrop={handleDrop}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        style={hoverStyle}
        className={className}
      >
        {children}
      </div>
    )
  }

  return (
    <g
      id={elementId}
      onDrop={handleDrop}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      style={hoverStyle}
    >
      {children}
    </g>
  )
}
