const { contextBridge, ipcRenderer } = require("electron");
const fs = require("fs");
const path = require("path");

contextBridge.exposeInMainWorld("electronAPI", {
  // Opens a folder picker dialog in the main process
  openFolder: () => ipcRenderer.invoke("dialog:openFolder"),

  // Safely read directory contents; returns [] on error
  readDir: (dirPath) => {
    try {
      return fs.readdirSync(dirPath);
    } catch (err) {
      console.error("readDir error:", err);
      return [];
    }
  },

  // Read file content (utf-8)
  readFile: (filePath) => fs.readFileSync(filePath, "utf-8"),

  // Safely check if a path is a directory; returns false on error
  isDirectory: (filePath) => {
    try {
      return fs.statSync(filePath).isDirectory();
    } catch (err) {
      console.error("isDirectory error:", err);
      return false;
    }
  },

  // Join paths in an OS-safe way
  joinPath: (...args) => path.join(...args),
});