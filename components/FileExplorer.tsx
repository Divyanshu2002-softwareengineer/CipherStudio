
import React, { useState } from 'react';
import { File, Plus, Trash2, Edit, X, Check } from 'lucide-react';
import { SandpackFiles } from '@codesandbox/sandpack-react';

interface FileExplorerProps {
  files: SandpackFiles;
  activeFile: string;
  onSelectFile: (path: string) => void;
  onCreateFile: (path: string) => void;
  onDeleteFile: (path: string) => void;
  onRenameFile: (oldPath: string, newPath: string) => void;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({ files, activeFile, onSelectFile, onCreateFile, onDeleteFile, onRenameFile }) => {
  const [newFileName, setNewFileName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [renamingFile, setRenamingFile] = useState<string | null>(null);
  const [updatedFileName, setUpdatedFileName] = useState('');

  const handleCreateFile = () => {
    if (newFileName && !files[`/${newFileName}`]) {
      onCreateFile(`/${newFileName}`);
      setNewFileName('');
      setIsCreating(false);
    } else {
      alert('Invalid or duplicate file name.');
    }
  };

  const handleRename = () => {
    if (renamingFile && updatedFileName && `/${updatedFileName}` !== renamingFile) {
        if (files[`/${updatedFileName}`]) {
            alert('A file with this name already exists.');
            return;
        }
      onRenameFile(renamingFile, `/${updatedFileName}`);
      setRenamingFile(null);
      setUpdatedFileName('');
    }
  };
  
  const startRename = (path: string) => {
    setRenamingFile(path);
    setUpdatedFileName(path.substring(1)); // Remove leading '/'
  };

  return (
    <div className="bg-light-surface dark:bg-dark-surface w-64 p-2 border-r border-light-border dark:border-dark-border flex flex-col">
      <div className="flex justify-between items-center mb-2 p-2">
        <h2 className="text-sm font-bold uppercase tracking-wider">Files</h2>
        <button onClick={() => setIsCreating(true)} className="p-1 rounded hover:bg-light-bg dark:hover:bg-dark-bg" title="New File">
          <Plus size={18} />
        </button>
      </div>
      <ul className="flex-grow">
        {isCreating && (
          <li className="flex items-center space-x-1 p-1">
            <File size={16} className="text-gray-500 flex-shrink-0" />
            <input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateFile()}
              onBlur={() => setIsCreating(false)}
              autoFocus
              className="text-sm bg-transparent w-full focus:outline-none focus:ring-1 focus:ring-light-primary rounded px-1"
              placeholder="Enter file name"
            />
          </li>
        )}
        {Object.keys(files)
        .filter(path => !files[path].hidden)
        .sort()
        .map(path => (
          <li key={path} className={`rounded text-sm ${activeFile === path ? 'bg-light-primary/20 dark:bg-light-primary/30' : 'hover:bg-light-bg dark:hover:bg-dark-bg'}`}>
             {renamingFile === path ? (
                <div className="flex items-center space-x-1 p-1.5">
                    <File size={16} className="text-gray-500 flex-shrink-0" />
                    <input
                        type="text"
                        value={updatedFileName}
                        onChange={(e) => setUpdatedFileName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleRename()}
                        onBlur={() => setRenamingFile(null)}
                        autoFocus
                        className="text-sm bg-transparent w-full focus:outline-none focus:ring-1 focus:ring-light-primary rounded px-1"
                    />
                    <button onClick={handleRename} className="p-1 text-green-500"><Check size={16} /></button>
                    <button onClick={() => setRenamingFile(null)} className="p-1 text-red-500"><X size={16} /></button>
                </div>
            ) : (
            <div className="flex items-center justify-between group">
              <button onClick={() => onSelectFile(path)} className="flex items-center space-x-2 p-1.5 flex-grow text-left truncate">
                <File size={16} className="text-gray-500 flex-shrink-0" />
                <span className="truncate">{path.substring(1)}</span>
              </button>
              <div className="opacity-0 group-hover:opacity-100 flex items-center pr-1">
                <button onClick={() => startRename(path)} className="p-1" title="Rename"><Edit size={14} /></button>
                <button onClick={() => onDeleteFile(path)} className="p-1 text-red-500" title="Delete"><Trash2 size={14} /></button>
              </div>
            </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
