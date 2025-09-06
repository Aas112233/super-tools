import React, { Suspense } from 'react';
import ErrorBoundary from './ErrorBoundary';

interface ToolWrapperProps {
  children: React.ReactNode;
  toolName: string;
}

const LoadingComponent = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
  </div>
);

const ToolWrapper: React.FC<ToolWrapperProps> = ({ children, toolName }) => {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <ErrorBoundary toolName={toolName}>
        {children}
      </ErrorBoundary>
    </Suspense>
  );
};

export default ToolWrapper;