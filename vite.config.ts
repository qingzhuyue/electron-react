/*
 * @Author: qingzhuyue qingzhuyue@foxmail.com
 * @Date: 2024-01-30 15:28:46
 * @LastEditors: qingzhuyue qingzhuyue@foxmail.com
 * @LastEditTime: 2024-07-01 23:41:46
 * @FilePath: /vite-electron-react/vite.config.ts
 * @Description: 
 * Copyright (c) 2024 by ${qingzhuyue} email: ${qingzhuyue@foxmail.com}, All Rights Reserved.
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from "vite-plugin-electron";
import electronRenderer from "vite-plugin-electron-renderer";
import polyfillExports from "vite-plugin-electron-renderer";

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    electron([{
      entry: "electron-main/index.ts", //主进程
    }, {
      entry: "electron-preload/preload.ts"
    }]),
    electronRenderer(),
    polyfillExports(),],
  build: {
    emptyOutDir: true, // outDir在root在根目录下，vite在构建的时候，会自动清空目录
    outDir: "dist-electron",
    // 打包环境移除console.log，debugger
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
  }
})
