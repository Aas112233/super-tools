import React from 'react';
import ToolErrorFallback from './ToolErrorFallback';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  toolName?: string;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error for debugging purposes
    console.error('Tool error caught by ErrorBoundary:', error);
    console.error('Error info:', errorInfo);
    
    // You can also log the error to an error reporting service here
    // logErrorToService(error, errorInfo);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps, prevState: ErrorBoundaryState) {
    // Reset error state when location changes (new route)
    if (prevState.hasError && !this.state.hasError) {
      this.setState({ hasError: false, error: undefined });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <ToolErrorFallback
          error={this.state.error}
          resetError={() => this.setState({ hasError: false, error: undefined })}
          toolName={this.props.toolName || 'Tool'}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;