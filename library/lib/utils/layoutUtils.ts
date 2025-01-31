/**
 * Calculates the minimum width required to fit the text with specified padding and margin.
 * @param maxTextWidth - The maximum width of the text.
 * @param padding - The inner padding for text.
 * @param margin - The outer margin.
 * @returns The calculated minimum width.
 */
export const calculateMinWidth = (
  maxTextWidth: number,
  padding: number,
  margin: number
): number => {
  return maxTextWidth + 2 * padding + 2 * margin
}

/**
 * Calculates the minimum height based on header, attributes, methods, and margins.
 * @param headerHeight - The height of the header section.
 * @param attributesCount - Number of attributes.
 * @param methodsCount - Number of methods.
 * @param attributeHeight - Height per attribute.
 * @param methodHeight - Height per method.
 * @param margin - The outer margin.
 * @returns The calculated minimum height.
 */
export const calculateMinHeight = (
  headerHeight: number,
  attributesCount: number,
  methodsCount: number,
  attributeHeight: number,
  methodHeight: number,
  margin: number
): number => {
  return (
    headerHeight +
    attributesCount * attributeHeight +
    methodsCount * methodHeight +
    margin
  )
}
