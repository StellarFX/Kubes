import React from 'react';
import './Preferences.scss';
import { TextInput } from '@mantine/core';

function Preferences(){

    return (
        <div className='preferences page-main-container'>
          <div className='page-title-container'>
            <p className='page-title'>Preferences</p>
          </div>
          <div className='page-content'>
            <div className='item'>
              <span>Default server path:</span>
              <TextInput className="input i-servername" placeholder="C:/Poggers/Documents/Kubes Servers/" required/>
            </div>
          </div>
        </div>
      );

}

export default Preferences;