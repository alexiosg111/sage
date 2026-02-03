/* eslint-disable @typescript-eslint/no-require-imports */
const { app, BrowserWindow } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'SAGE Club Admin',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    backgroundColor: '#fafafa',
  });

  // In development, load from the local dev server
  // In production, you would typically load from the build output
  // For simplicity here, we'll assume it's running via dev server or local proxy
  const startUrl = process.env.ELECTRON_START_URL || 'http://localhost:3000/admin';
  win.loadURL(startUrl);

  win.on('page-title-updated', (e) => {
    e.preventDefault();
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
