/*
 * @Author: qingzhuyue qingzhuyue@foxmail.com
 * @Date: 2024-01-30 17:21:20
 * @LastEditors: qingzhuyue qingzhuyue@foxmail.com
 * @LastEditTime: 2024-08-14 22:25:41
 * @FilePath: /vite-electron-react/electron-preload/preload.ts
 * @Description: 
 * Copyright (c) 2024 by ${qingzhuyue} email: ${qingzhuyue@foxmail.com}, All Rights Reserved.
 */
import {contextBridge, ipcRenderer, IpcRendererEvent} from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  send: (channel, data) => {  
    console.log("发送的通道：",channel)
    // 白名单验证channel  
    let validChannels = ['toMain','toUpdateMes'];  
    if (validChannels.includes(channel)) {  
      ipcRenderer.send(channel, data);  
    }  
  },  
  receive: (channel, func) => {  
    console.log("接收的通道：",channel)
    let validChannels = ['updateMes','fromMain'];  
    if (validChannels.includes(channel)) {  
      ipcRenderer.on(channel, (event, ...args) => func(...args));  
    }  
  }  
});