import baseStyled from "styled-components"

// Default Colors
const defaultStrokeColor = "black"
const defaultFillColor = "white"
const defaultPrimaryContrast = "#ffffff" // Example: white
const defaultBackground = "#000000" // Example: black

// Themed Polyline
export const ThemedPolyline = baseStyled.polyline.attrs(
  (props: { fillColor?: string; strokeColor?: string }) => ({
    fillColor: props.fillColor || defaultFillColor,
    strokeColor: props.strokeColor || defaultStrokeColor,
    stroke: props.strokeColor || defaultStrokeColor,
    fill: props.fillColor || defaultFillColor,
  })
)`
  fill: ${(props) => props.fillColor || defaultBackground};
  stroke: ${(props) => props.strokeColor || defaultPrimaryContrast};
`

// Themed Path
export const ThemedPath = baseStyled.path.attrs(
  (props: { fillColor?: string; strokeColor?: string }) => ({
    fillColor: props.fillColor || defaultFillColor,
    strokeColor: props.strokeColor || defaultStrokeColor,
    stroke: props.strokeColor || defaultStrokeColor,
    fill: props.fillColor || defaultFillColor,
  })
)`
  fill: ${(props) => props.fillColor || defaultBackground};
  stroke: ${(props) => props.strokeColor || defaultPrimaryContrast};
`

// Themed Path Contrast
export const ThemedPathContrast = baseStyled.path.attrs(
  (props: { fillColor?: string; strokeColor?: string }) => ({
    fillColor: props.fillColor || defaultBackground,
    strokeColor: props.strokeColor || defaultPrimaryContrast,
    stroke: props.strokeColor || defaultPrimaryContrast,
    fill: props.fillColor || defaultBackground,
  })
)`
  fill: ${(props) => props.fillColor || defaultPrimaryContrast};
  stroke: ${(props) => props.strokeColor || defaultBackground};
`

// Themed Rect
export const ThemedRect = baseStyled.rect.attrs(
  (props: { fillColor?: string; strokeColor?: string }) => ({
    fillColor: props.fillColor || defaultFillColor,
    strokeColor: props.strokeColor || defaultStrokeColor,
    stroke: props.strokeColor || defaultStrokeColor,
    fill: props.fillColor || defaultFillColor,
  })
)`
  fill: ${(props) => props.fillColor || defaultBackground};
  stroke: ${(props) => props.strokeColor || defaultPrimaryContrast};
`

// Themed Rect Contrast
export const ThemedRectContrast = baseStyled.rect.attrs(
  (props: { fillColor?: string; strokeColor?: string }) => ({
    fillColor: props.fillColor || defaultBackground,
    strokeColor: props.strokeColor || defaultPrimaryContrast,
    stroke: props.strokeColor || defaultPrimaryContrast,
    fill: props.fillColor || defaultBackground,
  })
)`
  fill: ${(props) => props.fillColor || defaultPrimaryContrast};
  stroke: ${(props) => props.strokeColor || defaultBackground};
`

// Themed Circle
export const ThemedCircle = baseStyled.circle.attrs(
  (props: { fillColor?: string; strokeColor?: string }) => ({
    fillColor: props.fillColor || defaultFillColor,
    strokeColor: props.strokeColor || defaultStrokeColor,
    stroke: props.strokeColor || defaultStrokeColor,
    fill: props.fillColor || defaultFillColor,
  })
)`
  fill: ${(props) => props.fillColor || defaultBackground};
  stroke: ${(props) => props.strokeColor || defaultPrimaryContrast};
`

// Themed Circle Contrast
export const ThemedCircleContrast = baseStyled.circle.attrs(
  (props: { fillColor?: string; strokeColor?: string }) => ({
    fillColor: props.fillColor || defaultBackground,
    strokeColor: props.strokeColor || defaultPrimaryContrast,
    stroke: props.strokeColor || defaultPrimaryContrast,
    fill: props.fillColor || defaultBackground,
  })
)`
  fill: ${(props) => props.fillColor || defaultPrimaryContrast};
  stroke: ${(props) => props.strokeColor || defaultBackground};
`

// Themed Ellipse
export const ThemedEllipse = baseStyled.ellipse.attrs(
  (props: { fillColor?: string; strokeColor?: string }) => ({
    fillColor: props.fillColor || defaultFillColor,
    strokeColor: props.strokeColor || defaultStrokeColor,
    stroke: props.strokeColor || defaultStrokeColor,
    fill: props.fillColor || defaultFillColor,
  })
)`
  fill: ${(props) => props.fillColor || defaultBackground};
  stroke: ${(props) => props.strokeColor || defaultPrimaryContrast};
`

// Themed Line
export const ThemedLine = baseStyled.line.attrs(
  (props: { strokeColor?: string }) => ({
    strokeColor: props.strokeColor || defaultStrokeColor,
    stroke: props.strokeColor || defaultStrokeColor,
  })
)`
  stroke: ${(props) => props.strokeColor || defaultPrimaryContrast};
`
