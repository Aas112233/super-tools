import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check for saved theme preference or default to dark mode
  const [isDark, setIsDark] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('super-tools-theme');
      return savedTheme ? JSON.parse(savedTheme) : true;
    } catch {
      return true;
    }
  });

  // Apply theme class to document element and save preference
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save theme preference to localStorage
    try {
      localStorage.setItem('super-tools-theme', JSON.stringify(isDark));
    } catch {
      // Silently fail if localStorage is not available
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};