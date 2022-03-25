import React , { useRef, useEffect, useState } from 'react';
import './Preferences.scss';
import { TextInput } from '@mantine/core';

const { ipcRenderer } = window.require('electron');

function Preferences() {

  const [inputValue, setInputValue] = useState("a");
  const inputFile = useRef(null)

  const onButtonClick = () => {
    // `current` points to the mounted file input element
    inputFile.current.click();
  };

  function readFiles(event){
    const name = event.target.files[0].name;
    const path = event.target.files[0].path.slice(0, -name.length - 1);
    ipcRenderer.send("change-path", path);
    console.log(path);
  }

  document.getElementById("server-path").addEventListener("keyup", (e)=>{

    if(e.keyCode == 13){
      ipcRenderer.send("check-path"/*, its value*/);
    }

  });

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
          <span className="title">- Default server path:</span>
          <div className='item-content'>
            <TextInput id="server-path" className="input directory-path" placeholder="C:/Poggers/Documents/Kubes Servers/" required />
            <span className="button" data-type="change-default-server-path" onClick={onButtonClick}>
              ...
              <input type="file" onChange={(e) => readFiles(e)} id="directory-input" ref={inputFile} style={{display: 'none'}} webkitdirectory="true"/>
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