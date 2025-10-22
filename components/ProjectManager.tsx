
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Projects, ProjectData } from '../types';
import { LOCAL_STORAGE_PROJECTS_KEY, DEFAULT_FILES } from '../constants';
import { Code, Trash2, PlusCircle } from 'lucide-react';

interface ProjectManagerProps {
  onSelectProject: (id: string) => void;
}

export const ProjectManager: React.FC<ProjectManagerProps> = ({ onSelectProject }) => {
  const [projects, setProjects] = useLocalStorage<Projects>(LOCAL_STORAGE_PROJECTS_KEY, {});
  const [newProjectName, setNewProjectName] = useState('');

  const createNewProject = () => {
    if (!newProjectName.trim()) {
      alert("Project name can't be empty.");
      return;
    }
    const newId = uuidv4();
    const newProject: ProjectData = {
      id: newId,
      name: newProjectName,
      files: DEFAULT_FILES,
      updatedAt: new Date().toISOString(),
    };
    setProjects({ ...projects, [newId]: newProject });
    setNewProjectName('');
    onSelectProject(newId);
  };

  const deleteProject = (id: string) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      const updatedProjects = { ...projects };
      delete updatedProjects[id];
      setProjects(updatedProjects);
    }
  };
  
  const sortedProjects = Object.values(projects).sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <Code className="mx-auto h-16 w-16 text-light-primary" />
          <h1 className="text-4xl font-bold mt-4">CipherStudio</h1>
          <p className="text-lg mt-2 text-gray-600 dark:text-gray-400">Your Browser-Based React IDE</p>
        </div>

        <div className="bg-light-surface dark:bg-dark-surface p-6 rounded-lg shadow-md border border-light-border dark:border-dark-border">
          <h2 className="text-2xl font-semibold mb-4">Create New Project</h2>
          <div className="flex space-x-2">
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Enter project name..."
              className="flex-grow bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-light-primary"
              onKeyPress={(e) => e.key === 'Enter' && createNewProject()}
            />
            <button
              onClick={createNewProject}
              className="bg-light-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90 flex items-center space-x-2 transition-colors"
            >
              <PlusCircle size={18} />
              <span>Create</span>
            </button>
          </div>
        </div>
        
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-center">Or Open an Existing Project</h2>
          {sortedProjects.length > 0 ? (
            <ul className="space-y-3">
              {sortedProjects.map((project) => (
                <li
                  key={project.id}
                  className="bg-light-surface dark:bg-dark-surface rounded-lg shadow-md border border-light-border dark:border-dark-border flex items-center justify-between p-4 transition-all hover:shadow-lg hover:border-light-primary dark:hover:border-light-primary"
                >
                  <button onClick={() => onSelectProject(project.id)} className="flex-grow text-left">
                    <p className="font-semibold text-lg">{project.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Last updated: {new Date(project.updatedAt).toLocaleString()}
                    </p>
                  </button>
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-500/10 transition-colors"
                    aria-label="Delete project"
                  >
                    <Trash2 size={20} />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 mt-6">No projects found. Create one to get started!</p>
          )}
        </div>
      </div>
    </div>
  );
};
