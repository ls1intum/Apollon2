export function sanitizeSVG(svgString: string): string {
  return svgString
  return mockedSVG
  // 1. Remove externalResourcesRequired="true"
  let cleaned = svgString.replace(/externalResourcesRequired="true"/g, "")

  // 2. Remove font-family and other font-related inline styles
  cleaned = cleaned.replace(/font-[^:;"]+:\s?[^;"]+;?/g, "")
  cleaned = cleaned.replace(/font:\s?[^;"]+;?/g, "") // Remove shorthand `font:` as well

  // 3. Insert <defs><style>...</style></defs> right after opening <svg>
  const styleBlock = `
  <defs>
    <style>
      text {
        fill: #212529;
        font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
        font-size: 16px;
      }
      path {
        stroke: #000;
      }
      marker, text {
        fill-opacity: 1;
      }
      * {
        overflow: visible;
      }
    </style>
  </defs>`

  cleaned = cleaned.replace(/<svg([^>]+)>/, `<svg$1>\n${styleBlock}`)

  return cleaned
}

const mockedSVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="550" height="550" viewBox="0 0 550 550">
    <foreignObject width="100%" height="100%" x="0" y="0" >
<svg>

<rect x="0" y="0" width="100%" height="100%" fill="white" />
</svg>
    </foreignObject>
    

</svg>`
