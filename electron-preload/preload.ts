/*
 * @Author: qingzhuyue qingzhuyue@foxmail.com
 * @Date: 2024-01-30 17:21:20
 * @LastEditors: qingzhuyue qingzhuyue@foxmail.com
 * @LastEditTime: 2024-08-08 23:18:58
 * @FilePath: /vite-electron-react/electron-preload/preload.ts
 * @Description: 
 * Copyright (c) 2024 by ${qingzhuyue} email: ${qingzhuyue@foxmail.com}, All Rights Reserved.
 */
import {contextBridge, ipcRenderer, IpcRendererEvent} from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  send: (channel, data) => {  
    // 白名单验证channel  
    let validChannels = ['toMain'];  
    if (validChannels.includes(channel)) {  
      ipcRenderer.send(channel, data);  
    }  
  },  
  receive: (channel, func) => {  
    let validChannels = ['fromMain','updateMes'];  
    if (validChannels.includes(channel)) {  
      // Deliberately strip event as it includes `sender`  
      ipcRenderer.on(channel, (event, ...args) => func(...args));  
    }  
  }  
});