/*
 * @Author: qingzhuyue qingzhuyue@foxmail.com
 * @Date: 2024-01-30 17:21:35
 * @LastEditors: qingzhuyue qingzhuyue@foxmail.com
 * @LastEditTime: 2024-08-14 22:48:38
 * @FilePath: /vite-electron-react/electron-main/index.ts
 * @Description: 
 * Copyright (c) 2024 by ${qingzhuyue} email: ${qingzhuyue@foxmail.com}, All Rights Reserved.
 */
import { app, BrowserWindow, ipcMain, WebContents, Certificate, dialog, IpcRendererEvent,contentTracing ,nativeImage, Tray} from "electron"
import path, { join } from "path";
import { autoUpdater } from 'electron-updater';

let mainWindow: BrowserWindow;

process.env.DIST_ELECTRON = join(__dirname, '..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.PUBLIC = app.isPackaged
    ? process.env.DIST
    : join(process.env.DIST_ELECTRON, '../public')


const createWindow = () => {
    // const tray = new Tray('../public/bg.png')
    mainWindow = new BrowserWindow({
        title: 'electron 应用',
        icon: path.join(process.env.PUBLIC, 'vite.svg'),
        webPreferences: {
            preload: path.join(__dirname, './preload.js'),
            nodeIntegration: false, // 渲染进程使用Node API
            contextIsolation: true, // 是否隔离上下文
            webSecurity: true
        },
    });

    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL('http://localhost:5173')
        mainWindow.webContents.openDevTools()
    } else {
        mainWindow.loadFile(path.join(__dirname, './index.html'));
        mainWindow.webContents.openDevTools()
    }
}


// 更新操作
const updateHandle = (callback) => {
    let message = {
        error: '检查更新出错',
        checking: '正在检查更新...',
        updateAva: '检测到新版本，准备下载...',
        updateNotAva: '已经是最新版本，不必要更新',
        isDown:'通知用户更新已下载，并重启应用'
    };
    autoUpdater.checkForUpdates();
    const feelUrl = 'http://8.130.44.166/electron_files';
    
    // ios 系统的更新配置
    if (process.platform === 'darwin') {
        callback(message.checking)
        autoUpdater.setFeedURL({
            provider: 'generic',
            url: `${feelUrl}/release`
            // 注意：这里使用 .yml 文件来指定 .zip 文件的下载 URL，但你也可以直接设置 .zip 文件的 URL  
        });
    }

    // 设置windows更新包的服务器地址  
    if (process.platform === 'win32') {
        callback(message.checking)
        autoUpdater.setFeedURL('https://你的服务器地址/updates/win32/' + process.arch);
    }
    autoUpdater.on('update-available', (info) => {  
        console.log('Update available: ', info.version);  
        callback(`更新信息：${info}`)
        // 可以在这里提示用户更新  
      });  

    autoUpdater.on('update-downloaded', (info) => {
        callback(message.isDown)
        // 通知用户更新已下载，并重启应用  
        autoUpdater.quitAndInstall();
    });

    // 监听更新下载进度  
    autoUpdater.on('download-progress', (progressObj) => {
        let log_message = `下载速度: ${progressObj.bytesPerSecond} - 下载了 ${progressObj.percent}% (${progressObj.transferred}/${progressObj.total})`;
        console.log(log_message);
        callback(log_message)
    });
    // 监听错误  
    autoUpdater.on('error', (err) => {
        console.log(err);
        callback(`更新报错：${err}`)
    });
    // 检查更新  
    autoUpdater.checkForUpdates();
};



// 应用程序完成基础的启动的时候被触发
app.on('will-finish-launching', () => {
    console.log("应用程序完成基础的启动的时候被触发")
})
app.on("ready", (event) => {
    console.log("ready", process.arch);
    // autoUpdater.checkForUpdatesAndNotify();
    createWindow(); // 创建窗口
    updateHandle((mes)=>{
        ipcMain.on("toUpdateMes",(event,data)=>{
            mainWindow.webContents.send("updateMes", mes);
        })
    });
    ipcMain.on("toMain", (event, data) => {
        console.log("打开新的窗口：", data, event)
        mainWindow.webContents.send("fromMain", data);
        // event.reply('fromMain', data);
    });

    (async () => {
        await contentTracing.startRecording({
          included_categories: ['*']
        })
        console.log('Tracing started')
        await new Promise(resolve => setTimeout(resolve, 5000))
        const path = await contentTracing.stopRecording()
        console.log('追踪数据记录到： ' + path)
      })();

      
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
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
    console.log("创建渲染进程")
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
