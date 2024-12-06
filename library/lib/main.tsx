import ReactDOM from 'react-dom/client';
import AppWithProvider from './App';
import './index.module.css';

export class MyLibrary {
  private root: ReactDOM.Root | null = null;

  constructor(element: HTMLElement) {
    this.root = ReactDOM.createRoot(element);
    this.root.render(<AppWithProvider />);
  }

  // Expose any APIs or methods you want users to access
  public doSomething() {
    // Implementation
  }

  public dispose() {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
  }
}
