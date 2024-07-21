/*
 * @Author: qingzhuyue qingzhuyue@foxmail.com
 * @Date: 2024-07-01 21:18:41
 * @LastEditors: qingzhuyue qingzhuyue@foxmail.com
 * @LastEditTime: 2024-07-21 23:50:01
 * @FilePath: /vite-electron-react/src/preload.d.ts
 * @Description: 
 * Copyright (c) 2024 by ${qingzhuyue} email: ${qingzhuyue@foxmail.com}, All Rights Reserved.
 */
import { Channels } from 'main/preload';

declare global {
  interface Window {
    electronAPI: {
      [x: string]: any;
      receive(channel: Channels, args): void;
    };
  }
}