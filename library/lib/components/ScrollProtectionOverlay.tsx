import { useCallback, useEffect, useRef, useState } from "react"
import { Panel, useStore, useReactFlow } from "@xyflow/react"
import { useMetadataStore } from "@/store/context"
import { useShallow } from "zustand/shallow"

/**
 * Detects if the current platform is macOS.
 */
const isMacOS = (): boolean => {
  if (typeof navigator === "undefined") return false
  return /Mac|iPod|iPhone|iPad/.test(navigator.platform)
}

/**
 * Gets the platform-specific modifier key name.
 */
const getModifierKeyName = (): string => {
  return isMacOS() ? "⌘" : "Ctrl"
}

/**
 * Checks if the correct modifier key is pressed.
 */
const isModifierKeyPressed = (event: WheelEvent): boolean => {
  return isMacOS() ? event.metaKey : event.ctrlKey
}

/**
 * Detects if a wheel event is from a pinch gesture (trackpad).
 * Pinch-to-zoom events on trackpads typically have ctrlKey set to true
 * by the browser, even when the user isn't pressing the Ctrl key.
 */
const isPinchGesture = (event: WheelEvent): boolean => {
  // On macOS, pinch gestures with trackpad set ctrlKey = true
  // We detect this by checking if ctrlKey is set
  // This is the standard browser behavior for pinch gestures
  if (!event.ctrlKey) return false

  // When ctrlKey is set, it's either:
  // 1. A real Ctrl+scroll for zooming (which we want to allow)
  // 2. A pinch gesture (which we want to allow)
  // Either way, we allow it through
  return true
}

const OVERLAY_DISPLAY_DURATION_MS = 1500
const OVERLAY_FADE_DURATION_MS = 150

/**
 * ScrollProtectionOverlay component that prevents accidental scroll-to-zoom
 * interactions when the Apollon editor is embedded in a scrolling page.
 *
 * Similar to Google Maps' "Use ⌘ + scroll to zoom the map" pattern.
 *
 * Features:
 * - Shows a semi-transparent overlay with instructions when user tries to scroll without modifier
 * - Allows pinch-to-zoom gestures on trackpad/touch devices (detected via ctrlKey)
 * - Adapts to platform (⌘ on macOS, Ctrl on Windows/Linux)
 * - Overlay auto-hides after a brief delay
 *
 * Usage:
 * Enable scroll protection by setting `scrollProtection: true` in ApollonOptions.
 */
export const ScrollProtectionOverlay = () => {
  const [showOverlay, setShowOverlay] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const fadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const overlayContainerRef = useRef<HTMLDivElement>(null)

  const { scrollProtection } = useMetadataStore(
    useShallow((state) => ({
      scrollProtection: state.scrollProtection,
    }))
  )

  // Get the React Flow DOM node from the store for reliable element targeting
  const domNode = useStore((state) => state.domNode)

  const clearTimeouts = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = null
    }
    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current)
      fadeTimeoutRef.current = null
    }
  }, [])

  // Immediately hide the overlay without fade animation
  const hideOverlayImmediately = useCallback(() => {
    clearTimeouts()
    setIsVisible(false)
    setShowOverlay(false)
  }, [clearTimeouts])

  const hideOverlay = useCallback(() => {
    setIsVisible(false)
    fadeTimeoutRef.current = setTimeout(() => {
      setShowOverlay(false)
    }, OVERLAY_FADE_DURATION_MS)
  }, [])

  const showOverlayWithTimeout = useCallback(() => {
    clearTimeouts()
    setShowOverlay(true)
    // Small delay to trigger CSS transition
    requestAnimationFrame(() => {
      setIsVisible(true)
    })

    hideTimeoutRef.current = setTimeout(() => {
      hideOverlay()
    }, OVERLAY_DISPLAY_DURATION_MS)
  }, [clearTimeouts, hideOverlay])

  // Listen for modifier key press to immediately hide the overlay
  useEffect(() => {
    if (!scrollProtection || !showOverlay) return

    const handleKeyDown = (event: KeyboardEvent) => {
      // Hide immediately when the modifier key is pressed
      const modifierPressed = isMacOS() ? event.metaKey : event.ctrlKey
      if (modifierPressed) {
        hideOverlayImmediately()
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [scrollProtection, showOverlay, hideOverlayImmediately])

  // Get zoom functions from React Flow instance
  const { zoomIn, zoomOut } = useReactFlow()

  useEffect(() => {
    if (!scrollProtection || !domNode) return

    const handleWheel = (event: WheelEvent) => {
      // Always allow pinch gestures (trackpad pinch-to-zoom sets ctrlKey = true)
      // Pinch gestures are handled natively by the browser zoom
      if (isPinchGesture(event)) {
        // For pinch gestures, manually trigger zoom
        event.preventDefault()
        if (event.deltaY < 0) {
          zoomIn()
        } else {
          zoomOut()
        }
        return
      }

      // When modifier key is pressed (⌘ on Mac, Ctrl on Windows/Linux), zoom the diagram
      if (isModifierKeyPressed(event)) {
        event.preventDefault()
        if (event.deltaY < 0) {
          zoomIn()
        } else {
          zoomOut()
        }
        return
      }

      // No modifier key pressed - show the overlay hint
      // We DON'T call preventDefault() here, so the scroll event bubbles up
      // and the parent container can scroll
      showOverlayWithTimeout()
    }

    // Add wheel event listener - NOT in capture phase so it doesn't block scrolling
    domNode.addEventListener("wheel", handleWheel as EventListener, {
      passive: false,
    })

    return () => {
      domNode.removeEventListener("wheel", handleWheel as EventListener)
      clearTimeouts()
    }
  }, [
    scrollProtection,
    domNode,
    showOverlayWithTimeout,
    clearTimeouts,
    zoomIn,
    zoomOut,
  ])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimeouts()
    }
  }, [clearTimeouts])

  // Don't render anything if scroll protection is disabled
  if (!scrollProtection) {
    return null
  }

  // Only show the overlay when triggered
  if (!showOverlay) {
    return null
  }

  return (
    <Panel position="top-center" style={{ all: "unset" }}>
      <div
        ref={overlayContainerRef}
        className="scroll-protection-overlay"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          // Position relative to the viewport container
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(2px)",
          zIndex: 10000,
          opacity: isVisible ? 1 : 0,
          transition: `opacity ${OVERLAY_FADE_DURATION_MS}ms ease-in-out`,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            color: "#ffffff",
            padding: "16px 28px",
            borderRadius: "12px",
            fontSize: "15px",
            fontWeight: 500,
            fontFamily:
              "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
            boxShadow:
              "0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2)",
            textAlign: "center",
            maxWidth: "320px",
            lineHeight: 1.5,
            letterSpacing: "-0.01em",
          }}
        >
          <span style={{ whiteSpace: "nowrap" }}>
            Use{" "}
            <kbd
              style={{
                display: "inline-block",
                padding: "3px 10px",
                backgroundColor: "rgba(255, 255, 255, 0.12)",
                borderRadius: "6px",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                fontFamily: "inherit",
                fontSize: "14px",
                fontWeight: 600,
                marginLeft: "2px",
                marginRight: "2px",
              }}
            >
              {getModifierKeyName()}
            </kbd>{" "}
            + scroll to zoom the diagram
          </span>
        </div>
      </div>
    </Panel>
  )
}

export default ScrollProtectionOverlay
