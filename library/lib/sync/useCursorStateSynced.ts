import { stringToColor } from "./utils"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useReactFlow } from "@xyflow/react"
import { getCursorsMap, getYDoc } from "./ydoc"
import { Cursor } from "./type"

const MAX_IDLE_TIME = 10000

export function useCursorStateSynced() {
  const cursorId = useMemo(
    () => getYDoc().clientID.toString(),
    [getYDoc().clientID.toString()]
  )
  const cursorColor = useMemo(() => stringToColor(cursorId), [cursorId])
  const [cursors, setCursors] = useState<Cursor[]>([])
  const { screenToFlowPosition } = useReactFlow()

  // Flush any cursors that have gone stale.
  const flush = useCallback(() => {
    const now = Date.now()

    for (const [id, cursor] of getCursorsMap()) {
      if (now - cursor.timestamp > MAX_IDLE_TIME) {
        getCursorsMap().delete(id)
      }
    }
  }, [])

  const onMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      getCursorsMap().set(cursorId, {
        id: cursorId,
        color: cursorColor,
        x: position.x,
        y: position.y,
        timestamp: Date.now(),
      })
    },
    [screenToFlowPosition]
  )

  useEffect(() => {
    const timer = window.setInterval(flush, MAX_IDLE_TIME)
    const observer = () => {
      setCursors([...getCursorsMap().values()])
    }

    flush()
    setCursors([...getCursorsMap().values()])
    getCursorsMap().observe(observer)

    return () => {
      getCursorsMap().unobserve(observer)
      window.clearInterval(timer)
    }
  }, [flush])

  const cursorsWithoutSelf = useMemo(
    () => cursors.filter(({ id }) => id !== cursorId),
    [cursors]
  )

  return [cursorsWithoutSelf, onMouseMove] as const
}

export default useCursorStateSynced
