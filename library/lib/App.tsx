import { useState } from "react"

export function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      Library Count:{count}
      <button onClick={() => setCount(count + 1)}>
        Increment From Library
      </button>
    </div>
  )
}
