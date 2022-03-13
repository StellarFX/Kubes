import React from 'react';
import './Preferences.scss';
import { TextInput } from '@mantine/core';

function Preferences() {

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
              <span>Stable 1.0.0 (cc0861f)</span>
            </div>
            <div>
              <span>Host:</span>
              <span>Windows 10 64-Bit (10.0.19043)</span>
            </div>
           
          </div>
        </div>
        
        <div className='item'>
          <span className="title">- Default server path:</span>
          <div className='item-content'>
            <TextInput className="input i-servername" placeholder="C:/Poggers/Documents/Kubes Servers/" required />
            <span className="button" data-type="change-default-server-path">
              ...
            </span>
          </div>
        </div>
        
        <div className='item'>
          <span className="title">- Installation path:</span>
          <div className='item-content'>
            <TextInput className="input i-servername" placeholder="C:/Poggers/Documents/Kubes Servers/" required disabled />
          </div>
        </div>

      </div>
    </div>
  );

}

export default Preferences;