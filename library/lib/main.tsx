import ReactDOM from 'react-dom/client';
import AppWithProvider from './App';
import { ReactFlowInstance, type Node } from '@xyflow/react';
export { type Node } from '@xyflow/react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

export class Apollon2 {
  private root: ReactDOM.Root | null = null;
  private reactFlowInstance: ReactFlowInstance | null = null;

  constructor(element: HTMLElement) {
    this.root = ReactDOM.createRoot(element);
    this.root.render(
      <AppWithProvider
        onReactFlowInit={this.setReactFlowInstance.bind(this)}
      />,
    );
  }

  private setReactFlowInstance(instance: ReactFlowInstance) {
    this.reactFlowInstance = instance;
  }

  public getNodes(): Node[] {
    if (this.reactFlowInstance) {
      return this.reactFlowInstance?.getNodes();
    }
    return [];
  }

  public dispose() {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
  }
}