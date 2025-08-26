const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");

let mainWindow;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // preload used for ipc
      contextIsolation: true,
      sandbox: false, // allow Node.js in preload
    },
  });

  mainWindow.loadFile("index.html");
});

// Handle open file
ipcMain.handle("dialog:openFile", async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ["openFile"],
  });
  if (canceled) return null;

  const content = fs.readFileSync(filePaths[0], "utf-8");
  return { content, filePath: filePaths[0] };
});

// Handle save file
ipcMain.handle("dialog:saveFile", async (event, { content }) => {
  const { filePath } = await dialog.showSaveDialog({});
  if (!filePath) return null;

  fs.writeFileSync(filePath, content, "utf-8");
  return filePath;
});

// Handle open folder
ipcMain.handle("dialog:openFolder", async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ["openDirectory"],
  });
  if (canceled) return null;

  return filePaths[0];
});
