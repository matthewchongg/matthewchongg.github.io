import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Specialized ErrorBoundary for Three.js / WebGL / @react-three/fiber Canvas.
 * Prevents WebGL context initialization crashes from taking down the React root.
 */
export class WebGLErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.warn(
      '[WebGLErrorBoundary] WebGL Canvas initialization failed. Falling back to 2D Digital Twin:',
      error,
      errorInfo
    );
    this.props.onError?.(error, errorInfo);
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export default WebGLErrorBoundary;
