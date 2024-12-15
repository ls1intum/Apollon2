import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      {count}
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

export default App;
