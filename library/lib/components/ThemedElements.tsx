import baseStyled from "styled-components"

export const ThemedPolyline = baseStyled.polyline.attrs(
  (props: {
    fillColor: string | undefined
    strokeColor: string | undefined
  }) => ({
    fillColor: props.fillColor,
    strokeColor: props.strokeColor,
    stroke: props.strokeColor || "black",
    fill: props.fillColor || "white",
  })
)`
  fill: ${(props) => props.fillColor || props.theme.color.background};
  stroke: ${(props) => props.strokeColor || props.theme.color.primaryContrast};
`

export const ThemedPath = baseStyled.path.attrs(
  (props: {
    fillColor: string | undefined
    strokeColor: string | undefined
  }) => ({
    fillColor: props.fillColor,
    strokeColor: props.strokeColor,
    stroke: props.strokeColor || "black",
    fill: props.fillColor || "white",
  })
)`
  fill: ${(props) => props.fillColor || props.theme.color.background};
  stroke: ${(props) => props.strokeColor || props.theme.color.primaryContrast};
`

export const ThemedPathContrast = baseStyled.path.attrs(
  (props: {
    fillColor: string | undefined
    strokeColor: string | undefined
  }) => ({
    fillColor: props.fillColor,
    strokeColor: props.strokeColor,
    stroke: props.strokeColor || "white",
    fill: props.fillColor || "black",
  })
)`
  fill: ${(props) => props.fillColor || props.theme.color.primaryContrast};
  stroke: ${(props) => props.strokeColor || props.theme.color.background};
`

export const ThemedRect = baseStyled.rect.attrs(
  (props: {
    fillColor: string | undefined
    strokeColor: string | undefined
  }) => ({
    fillColor: props.fillColor,
    strokeColor: props.strokeColor,
    stroke: props.strokeColor || "black",
    fill: props.fillColor || "white",
  })
)`
  fill: ${(props) => props.fillColor || props.theme.color.background};
  stroke: ${(props) => props.strokeColor || props.theme.color.primaryContrast};
`

export const ThemedRectContrast = baseStyled.rect.attrs(
  (props: {
    fillColor: string | undefined
    strokeColor: string | undefined
  }) => ({
    fillColor: props.fillColor,
    strokeColor: props.strokeColor,
    stroke: props.strokeColor || "white",
    fill: props.fillColor || "black",
  })
)`
  fill: ${(props) => props.fillColor || props.theme.color.primaryContrast};
  stroke: ${(props) => props.strokeColor || props.theme.color.background};
`

export const ThemedCircle = baseStyled.circle.attrs(
  (props: {
    fillColor: string | undefined
    strokeColor: string | undefined
  }) => ({
    fillColor: props.fillColor,
    strokeColor: props.strokeColor,
    stroke: props.strokeColor || "black",
    fill: props.fillColor || "white",
  })
)`
  fill: ${(props) => props.fillColor || props.theme.color.background};
  stroke: ${(props) => props.strokeColor || props.theme.color.primaryContrast};
`

export const ThemedCircleContrast = baseStyled.circle.attrs(
  (props: {
    fillColor: string | undefined
    strokeColor: string | undefined
  }) => ({
    fillColor: props.fillColor,
    strokeColor: props.strokeColor,
    stroke: props.strokeColor || "white",
    fill: props.fillColor || "black",
  })
)`
  fill: ${(props) => props.fillColor || props.theme.color.primaryContrast};
  stroke: ${(props) => props.strokeColor || props.theme.color.background};
`

export const ThemedEllipse = baseStyled.ellipse.attrs(
  (props: {
    fillColor: string | undefined
    strokeColor: string | undefined
  }) => ({
    fillColor: props.fillColor,
    strokeColor: props.strokeColor,
    stroke: props.strokeColor || "black",
    fill: props.fillColor || "white",
  })
)`
  fill: ${(props) => props.fillColor || props.theme.color.background};
  stroke: ${(props) => props.strokeColor || props.theme.color.primaryContrast};
`

export const ThemedLine = baseStyled.line.attrs(
  (props: { strokeColor: string | undefined }) => ({
    strokeColor: props.strokeColor,
    stroke: props.strokeColor || "black",
  })
)`
  stroke: ${(props) => props.strokeColor || props.theme.color.primaryContrast};
`
