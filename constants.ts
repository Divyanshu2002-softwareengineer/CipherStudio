
import { SandpackFiles } from '@codesandbox/sandpack-react';

export const LOCAL_STORAGE_PROJECTS_KEY = 'cipher_studio_projects';

export const DEFAULT_FILES: SandpackFiles = {
  '/App.js': `import React from 'react';
import './styles.css';

export default function App() {
  return (
    <div className="App">
      <h1>Welcome to CipherStudio!</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}`,
  '/styles.css': `body {
  font-family: sans-serif;
  -webkit-font-smoothing: auto;
  -moz-font-smoothing: auto;
  -moz-osx-font-smoothing: grayscale;
  font-smoothing: auto;
  text-rendering: optimizeLegibility;
  font-smooth: always;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
}

.App {
  margin: 20px;
  text-align: center;
}`,
  '/index.js': `import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);`,
  '/public/index.html': `<!DOCTYPE html>
<html>
  <head>
    <title>Parcel Sandbox</title>
    <meta charset="UTF-8" />
  </head>
  <body>
    <div id="root"></div>
    <script src="../index.js"></script>
  </body>
</html>`,
  '/package.json': `{
  "name": "react-app",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "dependencies": {
    "react": "18.2.0",
    "react-dom": "18.2.0"
  }
}`
};
