import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      const prefersDark = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersDark);
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && isInitialized) {
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [isDark, isInitialized]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};