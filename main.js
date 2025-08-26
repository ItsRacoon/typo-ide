const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const fs = require("fs");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("index.html");

  // Listen for devtools request
  ipcMain.handle("openDevTools", () => {
    win.webContents.openDevTools();
  });

  // File open dialog
  ipcMain.handle("dialog:openFile", async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ["openFile"],
      filters: [{ name: "All Files", extensions: ["*"] }],
    });
    if (canceled || filePaths.length === 0) return null;

    const content = fs.readFileSync(filePaths[0], "utf-8");
    return { content, path: filePaths[0] };
  });

  // File save dialog
  ipcMain.handle("dialog:saveFile", async (event, { content }) => {
    const { canceled, filePath } = await dialog.showSaveDialog({
      filters: [{ name: "All Files", extensions: ["*"] }],
    });
    if (canceled || !filePath) return null;

    fs.writeFileSync(filePath, content, "utf-8");
    return filePath;
  });
}

app.whenReady().then(createWindow);
