/*
 * @Author: qingzhuyue qingzhuyue@foxmail.com
 * @Date: 2024-01-30 15:36:34
 * @LastEditors: qingzhuyue qingzhuyue@foxmail.com
 * @LastEditTime: 2024-01-30 15:54:22
 * @FilePath: /vite-electron-react/electron/main.js
 * @Description: 
 * Copyright (c) 2024 by ${qingzhuyue} email: ${qingzhuyue@foxmail.com}, All Rights Reserved.
 */
const { app, BrowserWindow } = require('electron')
const { join } = require('path')

const NODE_ENV = process.env.NODE_ENV

async function createWindow() {
  const mainWindow = new BrowserWindow({
    show: false, // Use 'ready-to-show' event to show window
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
    },
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show();

    if (NODE_ENV === 'development') {
      mainWindow?.webContents.openDevTools();
    }
  });

  // const { RENDERER_DEV_SERVER_URL } = process.env;

  // const pageUrl = NODE_ENV === 'development' && RENDERER_DEV_SERVER_URL
  //   ? RENDERER_DEV_SERVER_URL
  //   : new URL(join(__dirname, '../../renderer/build/index.html'), `file://${__dirname}`).toString();
  const pageUrl = NODE_ENV === 'development'? 'http://localhost:5173': `file://${path.join(__dirname, '../dist/index.html')}`

  await mainWindow.loadURL(pageUrl);
}

app.whenReady()
  .then(createWindow)
  .catch((e) => console.error('Failed to crate window:', e));

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

if (NODE_ENV !== 'development') {
  app.whenReady()
    .then(() => import('electron-updater'))
    .then(({ autoUpdater }) => autoUpdater.checkForUpdatesAndNotify())
    .catch((e) => console.error('Failed check updates:', e));
}

