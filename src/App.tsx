/*
 * @Author: qingzhuyue qingzhuyue@foxmail.com
 * @Date: 2024-01-30 15:28:46
 * @LastEditors: qingzhuyue qingzhuyue@foxmail.com
 * @LastEditTime: 2024-07-01 23:49:54
 * @FilePath: /vite-electron-react/src/App.tsx
 * @Description: 
 * Copyright (c) 2024 by ${qingzhuyue} email: ${qingzhuyue@foxmail.com}, All Rights Reserved.
 */
import { useState,useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0);
  const [text,setText] = useState("000");
  const [info,setInfo] = useState("")
console.log("接收主进程信息",window.electron.ipcRenderer)
const { isDownload, newWindow } = window.electron.ipcRenderer;
useEffect(() => {
  window.electron.ipcRenderer.updateMessage(function (text: any, info: any) {
    if (text.isUpdate) {
      setText('已经发现新版本')
      console.log('已经发现新版本，确定要更新吗?')
      isDownload();
     
    } else {
      
    }
  });
  window.electron.ipcRenderer.downloadVersion(function (
    data: any,
    info: any
  ) {
    if (data.download) {
      setInfo(data)
      console.log("下载信息",data)
    }
  });
}, []);
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
        <p>{text}</p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
        {info}
      </p>
    </>
  )
}

export default App
