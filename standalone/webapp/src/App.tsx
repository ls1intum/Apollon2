import { useState } from "react"
import { LibraryView } from "./LibraryView"

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      WebApp Count: {count}
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <LibraryView />
    </div>
  )
}

export default App
