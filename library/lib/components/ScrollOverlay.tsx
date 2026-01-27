import React, { useEffect, useState } from "react"
import { useMetadataStore } from "@/store/context"
import { useShallow } from "zustand/shallow"

/**
 * ScrollOverlay Component
 * Displays an overlay when user tries to scroll but scrollLock is enabled.
 * Press Space to temporarily unlock scrolling.
 */
export const ScrollOverlay: React.FC = () => {
  const { scrollLock, scrollEnabled, setScrollEnabled } = useMetadataStore(
    useShallow((state) => ({
      scrollLock: state.scrollLock,
      scrollEnabled: state.scrollEnabled,
      setScrollEnabled: state.setScrollEnabled,
    }))
  )

  const [showOverlay, setShowOverlay] = useState(false)
  const [hideTimeoutId, setHideTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null)

  // Handle Space key to temporarily enable scrolling
  useEffect(() => {
    if (!scrollLock) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault()
        setScrollEnabled(true)
        setShowOverlay(false)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setScrollEnabled(false)
      }
    }

    // Show overlay when user tries to scroll with mouse wheel
    const handleWheel = () => {
      setShowOverlay(true)

      // Clear existing timeout
      setHideTimeoutId((prevId) => {
        if (prevId) clearTimeout(prevId)
        return null
      })

      // Hide overlay after 3 seconds of no scroll attempts
      const newTimeoutId = setTimeout(() => {
        setShowOverlay(false)
      }, 3000)
      setHideTimeoutId(newTimeoutId)
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    window.addEventListener("wheel", handleWheel, { passive: true })

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      window.removeEventListener("wheel", handleWheel)
      if (hideTimeoutId) {
        clearTimeout(hideTimeoutId)
      }
    }
  }, [scrollLock, setScrollEnabled, hideTimeoutId])

  if (!scrollLock || !showOverlay || scrollEnabled) return null

  return (
    <div className="scroll-overlay" role="presentation">
      <div className="scroll-overlay-hint">
        <div className="scroll-overlay-hint-content">
          <p className="scroll-overlay-hint-text">Press Space for Scrolling</p>
        </div>
      </div>
    </div>
  )
}
