import ReactDOM from "react-dom/client"
import { App } from "./App"

export class Apollon2 {
  private root: ReactDOM.Root | null = null

  constructor(element: HTMLElement) {
    this.root = ReactDOM.createRoot(element)
    this.root.render(<App />)
  }

  public getRandomNumber(): number {
    return Math.random() * 100
  }

  public dispose() {
    if (this.root) {
      this.root.unmount()
      this.root = null
    }
  }
}
