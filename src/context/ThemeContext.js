import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('theme-preference');
    return savedTheme || 'system';
  });

  // Apply theme to document
  useEffect(() => {
    const applyTheme = (currentTheme) => {
      const root = document.documentElement;
      const body = document.body;
      
      // Remove existing theme class
      root.classList.remove('dark');
      
      if (currentTheme === 'dark') {
        root.classList.add('dark');
      } else if (currentTheme === 'system') {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          root.classList.add('dark');
        }
      }
      
      // Apply body styles
      if (currentTheme === 'dark' || (currentTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        body.style.backgroundColor = '#0f172a';
        body.style.color = '#f1f5f9';
      } else {
        body.style.backgroundColor = '#f8fafc';
        body.style.color = '#0f172a';
      }
    };

    applyTheme(theme);
    
    // Save to localStorage
    localStorage.setItem('theme-preference', theme);
  }, [theme]);

  // Listen for system theme changes when in system mode
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        const root = document.documentElement;
        const body = document.body;
        
        if (mediaQuery.matches) {
          root.classList.add('dark');
          body.style.backgroundColor = '#0f172a';
          body.style.color = '#f1f5f9';
        } else {
          root.classList.remove('dark');
          body.style.backgroundColor = '#f8fafc';
          body.style.color = '#0f172a';
        }
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  const updateTheme = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;