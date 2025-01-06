import { styled } from "styled-components"

// Default Colors
const defaultStrokeColor = "black"
const defaultFillColor = "white"
const defaultPrimaryContrast = "#ffffff" // Example: white
const defaultBackground = "#000000" // Example: black

// Themed Polyline
export const ThemedPolyline = styled.polyline`
  fill: ${(props) => props.fill || defaultBackground};
  stroke: ${(props) => props.stroke || defaultPrimaryContrast};
`

ThemedPolyline.defaultProps = {
  fill: defaultFillColor,
  stroke: defaultStrokeColor,
}

// Themed Path
export const ThemedPath = styled.path`
  fill: ${(props) => props.fill || defaultBackground};
  stroke: ${(props) => props.stroke || defaultPrimaryContrast};
`

ThemedPath.defaultProps = {
  fill: defaultFillColor,
  stroke: defaultStrokeColor,
}

// Themed Path Contrast
export const ThemedPathContrast = styled.path`
  fill: ${(props) => props.fill || defaultPrimaryContrast};
  stroke: ${(props) => props.stroke || defaultBackground};
`

ThemedPathContrast.defaultProps = {
  fill: defaultBackground,
  stroke: defaultPrimaryContrast,
}

// Themed Rect
export const ThemedRect = styled.rect`
  fill: ${(props) => props.fill || defaultBackground};
  stroke: ${(props) => props.stroke || defaultPrimaryContrast};
`

ThemedRect.defaultProps = {
  fill: defaultFillColor,
  stroke: defaultStrokeColor,
}

// Themed Rect Contrast
export const ThemedRectContrast = styled.rect`
  fill: ${(props) => props.fill || defaultPrimaryContrast};
  stroke: ${(props) => props.stroke || defaultBackground};
`

ThemedRectContrast.defaultProps = {
  fill: defaultBackground,
  stroke: defaultPrimaryContrast,
}

// Themed Circle
export const ThemedCircle = styled.circle`
  fill: ${(props) => props.fill || defaultBackground};
  stroke: ${(props) => props.stroke || defaultPrimaryContrast};
`

ThemedCircle.defaultProps = {
  fill: defaultFillColor,
  stroke: defaultStrokeColor,
}

// Themed Circle Contrast
export const ThemedCircleContrast = styled.circle`
  fill: ${(props) => props.fill || defaultPrimaryContrast};
  stroke: ${(props) => props.stroke || defaultBackground};
`

ThemedCircleContrast.defaultProps = {
  fill: defaultBackground,
  stroke: defaultPrimaryContrast,
}

// Themed Ellipse
export const ThemedEllipse = styled.ellipse`
  fill: ${(props) => props.fill || defaultBackground};
  stroke: ${(props) => props.stroke || defaultPrimaryContrast};
`

ThemedEllipse.defaultProps = {
  fill: defaultFillColor,
  stroke: defaultStrokeColor,
}

// Themed Line
export const ThemedLine = styled.line`
  stroke: ${(props) => props.stroke || defaultPrimaryContrast};
`

ThemedLine.defaultProps = {
  stroke: defaultStrokeColor,
}
