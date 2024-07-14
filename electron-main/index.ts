/*
 * @Author: qingzhuyue qingzhuyue@foxmail.com
 * @Date: 2024-01-30 17:21:35
 * @LastEditors: qingzhuyue qingzhuyue@foxmail.com
 * @LastEditTime: 2024-07-14 22:33:10
 * @FilePath: /vite-electron-react/electron-main/index.ts
 * @Description: 
 * Copyright (c) 2024 by ${qingzhuyue} email: ${qingzhuyue@foxmail.com}, All Rights Reserved.
 */
import { app, BrowserWindow, ipcMain, WebContents, Certificate, dialog, IpcRendererEvent } from "electron"
import path, { join } from "path";
import { autoUpdater } from 'electron-updater';

let mainWindow: BrowserWindow;

process.env.DIST_ELECTRON = join(__dirname, '..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.PUBLIC = app.isPackaged
    ? process.env.DIST
    : join(process.env.DIST_ELECTRON, '../public')


const createWindow = () => {
    mainWindow = new BrowserWindow({
        title: '编辑器',
        icon: path.join(process.env.PUBLIC, 'vite.svg'),
        webPreferences: {
            preload: path.join(__dirname, './preload.js'),
            nodeIntegration: true, // 渲染进程使用Node API
            contextIsolation: true, // 是否隔离上下文
        }
    });

    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL('http://localhost:5173')
        mainWindow.webContents.openDevTools()
    } else {
        mainWindow.loadFile(path.join(__dirname, './index.html'))
    }
}
const sendStatusToWindow = (params: any) => {
    mainWindow.webContents.send('message', params);
};
// 下载
const downloadVersion = (data: any) => {
    mainWindow.webContents.send('downloadVersion', data);
  };
// 更新操作
const updateHandle = () => {
    let message = {
        error: '检查更新出错',
        checking: '正在检查更新...',
        updateAva: '检测到新版本，准备下载...',
        updateNotAva: '已经是最新版本，不必要更新',
    };
    autoUpdater.checkForUpdates();
    const feelUrl = 'http://8.130.44.166/electron_files';
    autoUpdater.setFeedURL(feelUrl); // 设置上传的服务器地址

    autoUpdater.on('error', function (err: any) {
          sendStatusToWindow({ isUpdate: false, message: err });
    });
    // 在检查更新是否开始发出
    autoUpdater.on('checking-for-update', function () {
          sendStatusToWindow({ isUpdate: false, message: message.checking });
    });
    // 有可更新触发
    autoUpdater.on('update-available', function (info: any) {
        sendStatusToWindow({ isUpdate: true, message: message.updateAva });
    });
    // 没有检测到可更新的版本
    autoUpdater.on('update-not-available', function (info: any) {
        sendStatusToWindow({ isUpdate: false, message: message.updateNotAva });
    });
    autoUpdater.on('download-progress', function (progressObj: any) {
        let log_message = 'Download speed: ' + progressObj.bytesPerSecond;
        log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
        log_message =
            log_message +
            ' (' +
            progressObj.transferred +
            '/' +
            progressObj.total +
            ')';
        downloadVersion({
            download: true,
            ...progressObj,
        });
    });
    autoUpdater.on('update-downloaded', function () {
        sendStatusToWindow({ isUpdate: true, message: message.updateNotAva });
        autoUpdater.quitAndInstall();
    });
};

// 监听应用程序
app.whenReady().then(() => {
    console.log('whenReady事件')
    autoUpdater.checkForUpdatesAndNotify();
    updateHandle();
    createWindow(); // 创建窗口
})
// 应用程序完成基础的启动的时候被触发
app.on('will-finish-launching', () => {
    console.log("应用程序完成基础的启动的时候被触发")
})
app.on("ready", (event) => {
    console.log("ready");
    createWindow(); // 创建窗口
    ipcMain.handle('selectDate', (envet: any, date: any) => {
        console.log("渲染进程发送的日期", date)
        mainWindow.webContents.send("returnInfo", date)
    })
    ipcMain.handle('openFile', async (event: IpcRendererEvent) => {
        const webContents = event.sender;
        BrowserWindow.fromWebContents(webContents);
        let file = await dialog.showOpenDialog({
            title: "选择文件",
            message: "选择文件",
            buttonLabel: "按此打开文件",
        });
        if (file.filePaths && file.filePaths.length > 0) {
            mainWindow.webContents.send("filePath", file.filePaths[0]);


            console.log("file.filePaths[0]", file.filePaths[0])
        }
        mainWindow.webContents.send("versionInfo", app.getVersion());
    });
    ipcMain.handle("savaFile", async () => {
        await dialog.showSaveDialog({
            title: "保存文件"
        })
    })
    //  主进程向渲染进程发送版本信息

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
        new BrowserWindow({ width: 0, height: 0, show: false });
        // onlineStatusWindow.loadURL('file://' + __dirname + '/online-status.html');
        //
    });
})


// 当所有的窗口都被关闭时触发
app.on('window-all-closed', () => {
    console.log("当所有的窗口都被关闭时触发");
    if (process.platform !== 'darwin') app.quit()
})

app.on('before-quit', () => {
    console.log("before-quit")
})

app.on('will-quit', () => {
    console.log("will-quit")
})

app.on('quit', () => {
    console.log("quit")
})

app.on("open-file", () => {
    console.log("open-file")
})

app.on("open-url", () => {
    console.log("open-url")
})

app.on("activate", () => {
    console.log("activate")
})
// 身份核验的时候触发
app.on('login', (event, webContents, details, authInfo, callback) => {
    event.preventDefault()
    callback('username', 'secret')
})
// browserWindow 获得焦点的时候触发
app.on('browser-window-focus', () => {
    console.log("browser-window-focus")
})
// BrowserWindow创建的时候触发
app.on("browser-window-created", () => {
    console.log('browser-window-created')
})

app.on('web-contents-created', () => {
    console.log("web-contents-created")
})

// 证书相关的事件
app.on('certificate-error', (event, webContents: WebContents, url, error, certificate: Certificate, callback) => {
    if (url === 'https://github.com') {
        // Verification logic.
        event.preventDefault()
        callback(true)
    } else {
        callback(false)
    }
})
app.on('select-client-certificate', (event, webContents, url, list, callback) => {
    event.preventDefault()
    callback(list[0])
})

app.on('render-process-gone', () => {
    console.log("渲染进程意外消失触发")
})

app.on('child-process-gone', () => {
    console.log('子进程消失触发')
})
