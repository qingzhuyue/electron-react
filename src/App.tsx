/*
 * @Author: qingzhuyue qingzhuyue@foxmail.com
 * @Date: 2024-01-30 15:28:46
 * @LastEditors: qingzhuyue qingzhuyue@foxmail.com
 * @LastEditTime: 2024-08-08 23:19:27
 * @FilePath: /vite-electron-react/src/App.tsx
 * @Description: 
 * Copyright (c) 2024 by ${qingzhuyue} email: ${qingzhuyue@foxmail.com}, All Rights Reserved.
 */
import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const OPENROUTER_API_KEY = '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';
const YOUR_SITE_URL = "";
const YOUR_SITE_NAME = ""

function App() {
  const [text, setText]: any = useState(null)
  console.log("接收主进程信息", window.electronAPI)
  const { send, receive } = window.electronAPI;
  useEffect(() => {
    receive("fromMain", (data: string) => {
      console.log("主线程传过来的参数", data)
    })
    receive('updateMes',(data: string) => {
      console.log("更新信息", data)
      setText(data)
    })
    // fetch("https://openrouter.ai/api/v1/chat/completions", {
    //   method: "POST",
    //   headers: {
    //     "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
    //     "HTTP-Referer": `${YOUR_SITE_URL}`, // Optional, for including your app on openrouter.ai rankings.
    //     "X-Title": `${YOUR_SITE_NAME}`, // Optional. Shows in rankings on openrouter.ai.
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify({
    //     "model": "microsoft/phi-3-mini-128k-instruct:free",
    //     "messages": [
    //       { "role": "user", "content": "你好呀" },
    //     ],
    //     "provider": {
    //       "order": [
    //         "Azure",
    //         "Together"
    //       ]
    //     },
    //   })
    // }).then(res=>res.json()).then(res => {
    //   console.log(console.log("结果", res))
    // }).catch(err => {
    //   console.log("异常：", err)
    // });
  }, []);

  const openNewWindow = () => {
    send("toMain", "https://weread.qq.com/")
  }
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
      <div className="card">
        <button onClick={openNewWindow}>
          打开
        </button>
      </div>
      {
        text && <p>主线程传过来的参数{text}</p>
      }
    </>
  )
}

export default App
