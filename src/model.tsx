/*
 * @Author: qingzhuyue qingzhuyue@foxmail.com
 * @Date: 2024-10-24 17:30:20
 * @LastEditors: qingzhuyue qingzhuyue@foxmail.com
 * @LastEditTime: 2024-10-24 18:59:33
 * @FilePath: /electron-react/src/model.tsx
 * @Description: 
 * Copyright (c) 2024 by ${qingzhuyue} email: ${qingzhuyue@foxmail.com}, All Rights Reserved.
 */
export const Modal = {
  confirm({ onOk, onCancel }: { onOk: () => void, onCancel: () => void }) {
    let modal = document.createElement("div");
    modal.style.position = "fixed";
    modal.style.top = '0';
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.backgroundColor = "rgba(0,0,0,0.5)";
    modal.style.display = "flex";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";
    modal.style.visibility = "visible";
    modal.style.opacity = "1";
    modal.style.transition = "visibility 0s, opacity 0.3s linear";

    let modalContent = document.createElement("div");
    modalContent.style.backgroundColor = "#fefefe";
    modalContent.style.padding = "20px";
    modalContent.style.border = "1px solid #888";
    modalContent.style.textAlign = "center";
   

    let messageNode = document.createElement("p");
    messageNode.textContent = "弹窗文本内容";
    modalContent.appendChild(messageNode);
    let okBtnNode = document.createElement("button");
    let cancelBtnNode = document.createElement("button");
    okBtnNode.style.margin = "10px";
    cancelBtnNode.style.margin = "10px";

    okBtnNode.textContent = "ok";
    cancelBtnNode.textContent = "cancel";

    okBtnNode.onclick = ()=>{
      document.body.removeChild(modal);
      onOk();
    }
    cancelBtnNode.onclick = ()=>{
      document.body.removeChild(modal);
      onCancel()
    }
    
    modalContent.appendChild(okBtnNode);
    modalContent.appendChild(cancelBtnNode);


    modal.appendChild(modalContent)
    document.body.appendChild(modal)
  }
}

