import { Component } from 'react';
import type { ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch() {
    // You can log error info here if needed
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 32, textAlign: 'center', color: '#fff', background: '#1a1a1a', minHeight: '100vh' }}>
          <h1>Something went wrong.</h1>
          <pre style={{ color: '#ffb4b4', marginTop: 16 }}>{this.state.error?.message}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
