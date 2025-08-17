import React from 'react';
import { Wrench } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface ToolPageProps {
  title: string;
}

export const ToolPage: React.FC<ToolPageProps> = ({ title }) => {
  const { isDark } = useTheme();
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="max-w-2xl mx-auto text-center">
          <div className={`${isDark 
            ? 'bg-gradient-to-br from-slate-800/90 via-slate-700/70 to-slate-800/50 border-slate-600/30' 
            : 'bg-gradient-to-br from-white/90 via-slate-50/70 to-white/50 border-slate-200/30'} backdrop-blur-xl rounded-2xl p-12 border shadow-2xl`}>
            <div className="mb-6">
              <div className="bg-gradient-to-br from-amber-400 via-orange-400 to-red-400 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/25">
                <Wrench className="w-8 h-8 text-slate-900" />
              </div>
              <h1 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>{title}</h1>
              <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'} text-lg`}>
                This tool is currently under maintenance. We're working hard to bring you the best experience possible.
              </p>
            </div>
            
            <div className={`${isDark 
              ? 'bg-gradient-to-r from-slate-700/60 to-slate-800/40 border-slate-600/20' 
              : 'bg-gradient-to-r from-slate-100/60 to-slate-200/40 border-slate-300/20'} backdrop-blur-sm rounded-xl p-4 mt-8 border`}>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Expected to be available soon. Thank you for your patience!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};