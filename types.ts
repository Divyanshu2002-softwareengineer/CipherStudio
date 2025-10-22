
import { SandpackFiles } from '@codesandbox/sandpack-react';

export interface ProjectData {
  id: string;
  name: string;
  files: SandpackFiles;
  updatedAt: string;
}

export interface Projects {
  [key: string]: ProjectData;
}

export enum Theme {
  Light = 'light',
  Dark = 'dark'
}
