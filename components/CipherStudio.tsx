
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SandpackProvider, SandpackLayout, SandpackCodeEditor, SandpackPreview, SandpackFileExplorer } from '@codesandbox/sandpack-react';
import { nightOwl } from '@codesandbox/sandpack-themes';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { LOCAL_STORAGE_PROJECTS_KEY } from '../constants';
import { Projects, ProjectData, Theme } from '../types';
import { Header } from './Header';
import { FileExplorer } from './FileExplorer';
import type { SandpackFiles } from '@codesandbox/sandpack-react';

interface CipherStudioProps {
  projectId: string;
  onExit: () => void;
  theme: Theme;
  toggleTheme: () => void;
}

export const CipherStudio: React.FC<CipherStudioProps> = ({ projectId, onExit, theme, toggleTheme }) => {
  const [projects, setProjects] = useLocalStorage<Projects>(LOCAL_STORAGE_PROJECTS_KEY, {});
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [activeFile, setActiveFile] = useState('/App.js');
  const [isSaving, setIsSaving] = useState(false);
  const [autosave, setAutosave] = useState(true);
  const debounceTimer = useRef<number | null>(null);

  useEffect(() => {
    const data = projects[projectId];
    if (data) {
      setProjectData(data);
    } else {
      // Handle case where project is not found, maybe exit
      onExit();
    }
  }, [projectId, projects, onExit]);

  const saveProject = useCallback(() => {
    if (!projectData) return;
    setIsSaving(true);
    const updatedProject = { ...projectData, updatedAt: new Date().toISOString() };
    setProjects(prevProjects => ({
      ...prevProjects,
      [projectId]: updatedProject,
    }));
    setTimeout(() => setIsSaving(false), 500);
  }, [projectData, projectId, setProjects]);

  // Debounced save for autosave functionality
  const debouncedSave = useCallback(() => {
    if (debounceTimer.current) {
        window.clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = window.setTimeout(() => {
        saveProject();
    }, 1500);
  }, [saveProject]);

  useEffect(() => {
    if (autosave) {
        debouncedSave();
    }
    
    return () => {
      if (debounceTimer.current) {
        window.clearTimeout(debounceTimer.current);
      }
    };
  }, [projectData, autosave, debouncedSave]);

  const updateFiles = (newFiles: SandpackFiles, newActiveFile?: string) => {
    setProjectData(prev => prev ? { ...prev, files: newFiles } : null);
    if(newActiveFile) {
        setActiveFile(newActiveFile);
    }
  };

  const handleFileCreate = (path: string) => {
    if (!projectData) return;
    const newFiles = { ...projectData.files, [path]: { code: `// ${path}\n` } };
    updateFiles(newFiles, path);
  };

  const handleFileDelete = (path: string) => {
    if (!projectData) return;
    if (Object.keys(projectData.files).length <= 1) {
        alert("Cannot delete the last file.");
        return;
    }
    if(window.confirm(`Are you sure you want to delete ${path}?`)){
        const newFiles = { ...projectData.files };
        delete newFiles[path];
        const newActiveFile = path === activeFile ? Object.keys(newFiles)[0] : activeFile;
        updateFiles(newFiles, newActiveFile);
    }
  };

  const handleFileRename = (oldPath: string, newPath: string) => {
    if (!projectData) return;
    const newFiles = { ...projectData.files };
    const fileContent = newFiles[oldPath];
    delete newFiles[oldPath];
    newFiles[newPath] = fileContent;
    const newActiveFile = oldPath === activeFile ? newPath : activeFile;
    updateFiles(newFiles, newActiveFile);
  }

  if (!projectData) {
    return <div>Loading project...</div>;
  }

  return (
    <div className="h-screen w-screen flex flex-col text-light-text dark:text-dark-text">
        <Header 
            projectName={projectData.name}
            onExit={onExit}
            onSave={saveProject}
            theme={theme}
            toggleTheme={toggleTheme}
            isSaving={isSaving}
            autosave={autosave}
            setAutosave={setAutosave}
        />
        <div className="flex flex-grow overflow-hidden">
            <SandpackProvider 
                template="react" 
                files={projectData.files}
                theme={theme === Theme.Dark ? nightOwl : 'light'}
                options={{ 
                    activeFile,
                    onActiveFileChange: setActiveFile,
                    visibleFiles: Object.keys(projectData.files),
                 }}
                onCodeUpdate={(newFiles) => {
                    setProjectData(prev => prev ? {...prev, files: newFiles} : null);
                }}
            >
                <FileExplorer 
                    files={projectData.files}
                    activeFile={activeFile}
                    onSelectFile={setActiveFile}
                    onCreateFile={handleFileCreate}
                    onDeleteFile={handleFileDelete}
                    onRenameFile={handleFileRename}
                />
                <SandpackLayout className="flex-grow">
                    <SandpackCodeEditor 
                        showTabs 
                        showLineNumbers 
                        showInlineErrors
                        wrapContent
                        closableTabs
                    />
                    <SandpackPreview 
                        showOpenInCodeSandbox={false}
                        showRefreshButton={true}
                    />
                </SandpackLayout>
            </SandpackProvider>
        </div>
    </div>
  );
};
