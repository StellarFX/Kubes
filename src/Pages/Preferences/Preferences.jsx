import React , { useRef, useEffect, useState } from 'react';
import './Preferences.scss';
import { TextInput } from '@mantine/core';

const { ipcRenderer } = window.require('electron');

function Preferences() {

  const [inputValue, setInputValue] = useState("");
  const [initialized, setInitialized] = useState(false);

  useEffect(async()=>{
    let path = await ipcRenderer.invoke("initialize-path");
    setInputValue(path);
  },[]);

  async function onButtonClick() {
    let path = await ipcRenderer.invoke("change-path", inputValue);
    setInputValue(path);
  };

  async function changeValue(){
    console.log(inputValue)
    let path = await ipcRenderer.invoke('change-path-input', inputValue);
    console.log(path)
    setInputValue(path);
  }

  return (
    <div className='preferences page-main-container'>
      <div className='page-title-container'>
        <p className='page-title'>Preferences</p>
      </div>
      <div className='page-content'>
        <div className='item'>
          <span className="title">- Infos:</span>
          <div className='item-content infos'>
            <div>
              <span>Version:</span>
              <span>Stable&nbsp;1.0.0&nbsp;(cc0861f)</span>
            </div>
            <div>
              <span>Host:</span>
              <span>Windows&nbsp;10&nbsp;64-Bit&nbsp;(10.0.19043)</span>
            </div>
           
          </div>
        </div>
        
        <div className='item'>
          <span className="title">- Servers folder path:</span>
          <div className='item-content'>
            <TextInput value={inputValue} onBlur={()=>changeValue()} onChange={(e) => setInputValue(e.currentTarget.value)} id="server-path" className="input directory-path" placeholder="C:/Poggers/Documents/Kubes Servers/" required />
            <span className="button" data-type="change-default-server-path" onClick={()=>{onButtonClick()}}>
              ...
            </span>
          </div>
        </div>
        
        <div className='item'>
          <span className="title">- Installation path:</span>
          <div className='item-content'>
            <TextInput className="input directory-path" placeholder="C:/Poggers/Documents/Kubes Servers/" required disabled />
          </div>
        </div>

      </div>
    </div>
  );

}

export default Preferences;