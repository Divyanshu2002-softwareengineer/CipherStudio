
import React from 'react';
import { Moon, Sun, Save, LogOut, Code, AlertTriangle } from 'lucide-react';
import { Theme } from '../types';

interface HeaderProps {
  projectName: string;
  onExit: () => void;
  onSave: () => void;
  theme: Theme;
  toggleTheme: () => void;
  isSaving: boolean;
  autosave: boolean;
  setAutosave: (value: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ projectName, onExit, onSave, theme, toggleTheme, isSaving, autosave, setAutosave }) => {
  return (
    <header className="bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text border-b border-light-border dark:border-dark-border p-2 flex items-center justify-between shadow-sm h-14">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-light-primary font-bold">
          <Code size={24} />
          <span className="text-xl">CipherStudio</span>
        </div>
        <div className="h-6 w-px bg-light-border dark:bg-dark-border"></div>
        <span className="font-semibold text-lg">{projectName}</span>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2" title={autosave ? "Autosave is ON" : "Autosave is OFF. Remember to save manually."}>
          <label htmlFor="autosave-toggle" className="text-sm cursor-pointer">Autosave</label>
          <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
            <input 
              type="checkbox" 
              name="autosave-toggle" 
              id="autosave-toggle" 
              checked={autosave}
              onChange={() => setAutosave(!autosave)}
              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
            />
            <label htmlFor="autosave-toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 dark:bg-gray-600 cursor-pointer"></label>
          </div>
          <style>{`
            .toggle-checkbox:checked { right: 0; border-color: #4f46e5; }
            .toggle-checkbox:checked + .toggle-label { background-color: #4f46e5; }
          `}</style>
        </div>

        <button
          onClick={onSave}
          disabled={autosave || isSaving}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-blue-500 hover:bg-blue-600 text-white"
          title={autosave ? "Autosave is enabled" : "Save project"}
        >
          <Save size={16} />
          <span>{isSaving ? 'Saving...' : 'Save'}</span>
        </button>
        <button onClick={toggleTheme} className="p-2 rounded-md hover:bg-light-bg dark:hover:bg-dark-bg transition-colors" title="Toggle theme">
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button onClick={onExit} className="flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors text-red-500 hover:bg-red-500/10" title="Exit to project manager">
          <LogOut size={16} />
          <span>Exit</span>
        </button>
      </div>
    </header>
  );
};
