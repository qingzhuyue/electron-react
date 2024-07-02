/*
 * @Author: qingzhuyue qingzhuyue@foxmail.com
 * @Date: 2024-01-30 17:21:20
 * @LastEditors: qingzhuyue qingzhuyue@foxmail.com
 * @LastEditTime: 2024-07-01 23:21:00
 * @FilePath: /vite-electron-react/electron-preload/preload.ts
 * @Description: 
 * Copyright (c) 2024 by ${qingzhuyue} email: ${qingzhuyue@foxmail.com}, All Rights Reserved.
 */
import {contextBridge, ipcRenderer, IpcRendererEvent} from 'electron';

contextBridge.exposeInMainWorld('electron', {
    ipcRenderer: {
        selectDate: (date: string) => {
            return ipcRenderer.invoke('selectDate', date)
        },
        updateMessage: (func: (...args: unknown[]) => void) => {
          ipcRenderer.on('message', function (event, text, info) {
            func(text, info);
          });
        },
        isDownload:()=>ipcRenderer.send("isAutoUpdater"),
        downloadVersion:(func: (...args: unknown[]) => void)=>{
          ipcRenderer.on("downloadVersion",function(event, text, info){
            func(text, info);
          })
        },
        newWindow:()=>{}, //打开新窗口
    },
});