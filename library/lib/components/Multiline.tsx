import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  CSSProperties,
  SVGProps,
} from "react"

type DefaultProps = {
  x: number
  y: number
  dx: number
  dy: number
  angle: number
  width?: number
  height?: number
  lineHeight: number
  capHeight: number
  scaleToFit: boolean
  textAnchor: string
  verticalAnchor: string
}

type Props = { children: string } & SVGProps<SVGTextElement> & DefaultProps

type WordData = { word: string; width: number }
type LineData = { words: string[]; width: number }

export const Multiline: React.FC<Props> = (props) => {
  const {
    x,
    y,
    dx,
    dy,
    textAnchor,
    verticalAnchor,
    scaleToFit,
    angle,
    lineHeight,
    capHeight,
    fill,
    children,
    width,
    style,
    ...textProps
  } = props

  const [wordsByLines, setWordsByLines] = useState<LineData[]>([
    { words: children?.split(/\s+/) || [], width: 0 },
  ])
  const wordsWithComputedWidth = useRef<WordData[]>([])
  const spaceWidth = useRef(0)

  const calculateStringWidth = (str: string, style?: CSSProperties): number => {
    const divElem = document.createElement("div")
    divElem.innerHTML = str
    Object.assign(divElem.style, style)
    divElem.style.visibility = "hidden"
    divElem.style.position = "absolute"
    document.body.appendChild(divElem)
    const width = divElem.clientWidth + 2
    document.body.removeChild(divElem)
    return width
  }

  const calculateWordWidths = (text: string, style?: CSSProperties) => {
    const words = text.split(/\s+/)
    const computedWidths = words.map((word) => ({
      word,
      width: calculateStringWidth(word, style),
    }))
    const space = calculateStringWidth("\u00A0", style)
    return { wordsWithComputedWidth: computedWidths, spaceWidth: space }
  }

  const calculateWordsByLines = (
    words: WordData[],
    space: number,
    lineWidth?: number
  ): LineData[] => {
    return words.reduce<LineData[]>((lines, { word, width }) => {
      const currentLine = lines[lines.length - 1]

      if (
        currentLine &&
        (!lineWidth ||
          scaleToFit ||
          currentLine.width + width + space < lineWidth)
      ) {
        currentLine.words.push(word)
        currentLine.width += width + space
      } else {
        lines.push({ words: [word], width })
      }

      return lines
    }, [])
  }

  useEffect(() => {
    if (width || scaleToFit) {
      const wordData = calculateWordWidths(children, style)
      if (wordData) {
        wordsWithComputedWidth.current = wordData.wordsWithComputedWidth
        spaceWidth.current = wordData.spaceWidth

        const lines = calculateWordsByLines(
          wordData.wordsWithComputedWidth,
          wordData.spaceWidth,
          width
        )
        setWordsByLines(lines)
      }
    } else {
      setWordsByLines([{ words: children.split(/\s+/), width: 0 }])
    }
  }, [children, style, width, scaleToFit])

  const transforms = useMemo(() => {
    const xPosition = x + dx
    const yPosition = y + dy
    const transformList = []

    if (scaleToFit && wordsByLines.length && width) {
      const lineWidth = wordsByLines[0].width
      const sx = width / lineWidth
      const sy = sx
      const originX = xPosition - sx * xPosition
      const originY = yPosition - sy * yPosition
      transformList.push(`matrix(${sx}, 0, 0, ${sy}, ${originX}, ${originY})`)
    }

    if (angle) {
      transformList.push(`rotate(${angle}, ${xPosition}, ${yPosition})`)
    }

    return transformList.join(" ")
  }, [x, y, dx, dy, angle, scaleToFit, width, wordsByLines])

  const startDy = useMemo(() => {
    switch (verticalAnchor) {
      case "start":
        return capHeight
      case "middle":
        return ((wordsByLines.length - 1) / 2) * -lineHeight + capHeight / 2
      default:
        return wordsByLines.length - 1 * -lineHeight
    }
  }, [verticalAnchor, capHeight, wordsByLines, lineHeight])

  return (
    <text
      style={fill ? { fill } : {}}
      x={x + dx}
      y={y + dy}
      textAnchor={textAnchor}
      transform={transforms}
      {...textProps}
      pointerEvents="none"
    >
      {wordsByLines.map((line, index) => (
        <tspan x={x + dx} dy={index === 0 ? startDy : lineHeight} key={index}>
          {line.words.join(" ")}
        </tspan>
      ))}
    </text>
  )
}
