/*
 * @Author: qingzhuyue qingzhuyue@foxmail.com
 * @Date: 2024-01-30 15:28:46
 * @LastEditors: qingzhuyue qingzhuyue@foxmail.com
 * @LastEditTime: 2024-10-24 19:01:25
 * @FilePath: /electron-react/src/App.tsx
 * @Description: 
 * Copyright (c) 2024 by ${qingzhuyue} email: ${qingzhuyue@foxmail.com}, All Rights Reserved.
 */
import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {Modal} from "./model"

const OPENROUTER_API_KEY = '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';
const YOUR_SITE_URL = "";
const YOUR_SITE_NAME = ""
type BackendUser = {
  id: number
  name: string
  disabled: boolean
}
const arr: BackendUser[] = [{ id: 1, name: "jack", disabled: false }, { id: 2, name: "admin", disabled: true }]


type FrontendUser = {
  id: number
  name: string
}
function App() {
  const [text, setText]: any = useState(null)
  const { send, receive } = window.electronAPI;

  const confirm = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      Modal.confirm({
        onOk() { resolve(true) },
        onCancel() { resolve(false) }
      })
    })
  }

  const toDo = async ()=>{
    let result = await confirm();

    if(result){
      console.log("点击确认按钮")
    } else{
      console.log("点击取消按钮")
    }
  }
  useEffect(() => {
    toDo()
    send("toUpdateMes", "看看是不是有更新的")
    receive("fromMain", (data: string) => {
      console.log("主线程传过来的参数", data)
    })
    receive('updateMes', (data: string) => {
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

  useEffect(() => {


    function transform(users: BackendUser[]): FrontendUser[] {
      const activeUser: FrontendUser[] = users.reduce((acc: FrontendUser[], { id, name, disabled }) => {
        if (!disabled) {
          acc.push({ id, name });
          return acc;
        }
        return acc
      }, [])

      return activeUser
    }
  }, [])

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
        text && <p>主线程传过来的参数：{text}</p>
      }
    </>
  )
}

export default App
