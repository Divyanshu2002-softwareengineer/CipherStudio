
import React, { useState, useEffect, useMemo } from 'react';
import { ProjectManager } from './components/ProjectManager';
import { CipherStudio } from './components/CipherStudio';
import { Theme } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';

export default function App() {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [theme, setTheme] = useLocalStorage<Theme>('cipher-studio-theme', Theme.Dark);

  useEffect(() => {
    if (theme === Theme.Dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleSelectProject = (id: string) => {
    setProjectId(id);
  };

  const handleExitProject = () => {
    setProjectId(null);
  };
  
  const toggleTheme = () => {
    setTheme(currentTheme => currentTheme === Theme.Light ? Theme.Dark : Theme.Light);
  }

  const contextValue = useMemo(() => ({
    theme,
    toggleTheme,
  }), [theme]);

  if (!projectId) {
    return <ProjectManager onSelectProject={handleSelectProject} />;
  }

  return <CipherStudio projectId={projectId} onExit={handleExitProject} theme={theme} toggleTheme={toggleTheme} />;
}
