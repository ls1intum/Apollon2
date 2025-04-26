export const deepEqual = <T>(a: T, b: T): boolean => {
  // Strict equality check
  if (a === b) return true

  // Check if either is null or not an object
  if (
    a == null ||
    typeof a !== "object" ||
    b == null ||
    typeof b !== "object"
  ) {
    return false
  }

  // Handle arrays
  if (Array.isArray(a) !== Array.isArray(b)) return false

  // Get keys
  const keysA = Object.keys(a) as (keyof T)[]
  const keysB = Object.keys(b) as (keyof T)[]

  // Check if number of keys is different
  if (keysA.length !== keysB.length) return false

  // Check each key and value recursively
  for (const key of keysA) {
    if (!keysB.includes(key)) return false
    if (!deepEqual(a[key], b[key])) return false
  }

  return true
}
