import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface UniversalToolWrapperProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const UniversalToolWrapper: React.FC<UniversalToolWrapperProps> = ({ 
  title, 
  description,
  children 
}) => {
  const { isDark } = useTheme();
  
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {title}
          </h1>
          {description && (
            <p className={`text-lg ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {description}
            </p>
          )}
        </div>
        
        {/* Tool Content */}
        <div className="space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default UniversalToolWrapper;