import { SVGComponentProps, CustomText } from "@/components"
import { LINE_WIDTH } from "@/constants"
import { useDiagramStore } from "@/store"
import { FC, SVGAttributes } from "react"
import { useShallow } from "zustand/shallow"
import AssessmentIcon from "../../AssessmentIcon"

export type PackageSVGProps = SVGComponentProps & {
  width: number
  height: number
  name: string
  transformScale?: number
  svgAttributes?: SVGAttributes<SVGElement>
  showAssessmentResults?: boolean
}

const leftTopBoxHeight = 10
const padding = 5

export const PackageSVG: React.FC<PackageSVGProps> = ({
  id,
  width,
  height,
  name,
  svgAttributes,
  transformScale,
  showAssessmentResults = false,
}) => {
  const assessments = useDiagramStore(useShallow((state) => state.assessments))
  const svgWidth = showAssessmentResults ? width + 20 : width
  const svgHeight = showAssessmentResults ? height + 20 : height

  const nodeScore = assessments[id]?.score

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      viewBox={
        showAssessmentResults
          ? `0 -20 ${svgWidth} ${svgHeight}`
          : `0 0 ${svgWidth} ${svgHeight}`
      }
      style={{
        transformOrigin: "left top",
        transformBox: "content-box",
        transform: transformScale ? `scale(${transformScale})` : undefined,
      }}
      {...svgAttributes}
    >
      <g>
        <LeftTopBox leftTopBoxHeight={leftTopBoxHeight} />
        <MainBox
          width={width}
          height={height}
          leftTopBoxHeight={leftTopBoxHeight}
        />

        {/* Name Text */}
        <CustomText
          x={width / 2}
          y={leftTopBoxHeight + padding}
          textAnchor="middle"
          fontWeight="600"
          dominantBaseline="hanging"
        >
          {name}
        </CustomText>
      </g>

      {showAssessmentResults && (
        <AssessmentIcon x={width - 15} y={-5} score={nodeScore} />
      )}
    </svg>
  )
}

// Sub-components for better modularity

type LeftTopBoxProps = {
  leftTopBoxHeight: number
}

const LeftTopBox: FC<LeftTopBoxProps> = ({ leftTopBoxHeight }) => {
  return (
    <g>
      <rect fill="black" x={0} y={0} width={40} height={leftTopBoxHeight} />
      <rect
        x={1}
        y={1}
        width={40 - 2 * LINE_WIDTH}
        height={leftTopBoxHeight - LINE_WIDTH}
        fill="white"
      />
    </g>
  )
}

type MainBoxProps = {
  width: number
  height: number
  leftTopBoxHeight: number
}

const MainBox: FC<MainBoxProps> = ({ width, height, leftTopBoxHeight }) => {
  return (
    <g>
      <rect
        x={0}
        y={leftTopBoxHeight}
        width={width}
        height={height - leftTopBoxHeight}
        fill="black"
      />
      <rect
        x={1}
        y={leftTopBoxHeight + 1}
        width={width - 2 * LINE_WIDTH}
        height={height - leftTopBoxHeight - 2 * LINE_WIDTH}
        fill="white"
      />
    </g>
  )
}
