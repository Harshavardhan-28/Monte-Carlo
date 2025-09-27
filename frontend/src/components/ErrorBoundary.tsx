import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Only log errors that are not network-related
    if (!error.message.includes('Failed to fetch') && 
        !error.message.includes('Network Error') &&
        !error.message.includes('TypeError')) {
      console.error('Uncaught error:', error, errorInfo);
    }
  }

  public render() {
    if (this.state.hasError) {
      // Return null to render nothing, effectively suppressing the error
      return null;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;