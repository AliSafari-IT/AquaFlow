import React, { useEffect, useState } from 'react';
import './ThemeToggle.css';

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | 'auto';
    return saved || 'auto';
  });

  useEffect(() => {
    const applyTheme = (newTheme: 'light' | 'dark' | 'auto') => {
      const root = document.documentElement;
      
      if (newTheme === 'auto') {
        root.removeAttribute('data-theme');
      } else {
        root.setAttribute('data-theme', newTheme);
      }
      
      localStorage.setItem('theme', newTheme);
    };

    applyTheme(theme);
  }, [theme]);

  const handleThemeChange = () => {
    const themes: ('light' | 'dark' | 'auto')[] = ['light', 'dark', 'auto'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return '☀️';
      case 'dark':
        return '🌙';
      case 'auto':
        return '🔄';
      default:
        return '🔄';
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'auto':
        return 'Auto';
      default:
        return 'Auto';
    }
  };

  return (
    <button
      className="theme-toggle"
      onClick={handleThemeChange}
      title={`Current theme: ${getThemeLabel()}. Click to switch.`}
      aria-label={`Switch from ${getThemeLabel()} theme`}
    >
      <span className="theme-icon">{getThemeIcon()}</span>
      <span className="theme-label">{getThemeLabel()}</span>
    </button>
  );
};
