import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

/**
 * ECharts Error Boundary - Completely isolated error handling for chart components
 * This ensures that ANY error in ECharts components will NOT affect the rest of the application
 */
class EChartsErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to console (in production, you might want to send to error reporting service)
    console.error('ECharts Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI for chart errors
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="chart-error-container p-6 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500 mr-3" />
            <h3 className="text-lg font-semibold text-red-700">Chart Error</h3>
          </div>
          
          <div className="text-center mb-4">
            <p className="text-red-600 mb-2">
              Sorry, there was an error loading the chart component.
            </p>
            <p className="text-sm text-red-500">
              This error is isolated and won't affect other parts of the application.
            </p>
          </div>

          <div className="flex justify-center space-x-3">
            <button
              onClick={this.handleRetry}
              className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </button>
          </div>

          {/* Development error details (only show in development) */}
          {typeof window !== 'undefined' && window.location.hostname === 'localhost' && this.state.error && (
            <details className="mt-4 p-3 bg-red-100 rounded text-xs">
              <summary className="cursor-pointer font-medium text-red-700">
                Error Details (Development Only)
              </summary>
              <pre className="mt-2 whitespace-pre-wrap text-red-600">
                {this.state.error.toString()}
              </pre>
              {this.state.errorInfo && (
                <pre className="mt-2 whitespace-pre-wrap text-red-600">
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default EChartsErrorBoundary;