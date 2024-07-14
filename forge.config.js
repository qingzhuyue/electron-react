/*
 * @Author: qingzhuyue qingzhuyue@foxmail.com
 * @Date: 2024-07-14 23:03:49
 * @LastEditors: qingzhuyue qingzhuyue@foxmail.com
 * @LastEditTime: 2024-07-14 23:03:50
 * @FilePath: /vite-electron-react/forge.config.js
 * @Description: 
 * Copyright (c) 2024 by ${qingzhuyue} email: ${qingzhuyue@foxmail.com}, All Rights Reserved.
 */
module.exports = {
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'qingzhuyue',
          name: 'electron-react'
        },
        prerelease: false,
        draft: true
      }
    }
  ]
}