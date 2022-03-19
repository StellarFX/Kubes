import React from 'react';
import './TitleBar.scss';
import { faMinus, faX } from '@fortawesome/free-solid-svg-icons';
import { faSquare } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const { ipcRenderer } = window.require('electron');

export default function TitleBar() {

    function miminize(){
        ipcRenderer.send("minimize-window");
    }
    
    function maximize(){
        ipcRenderer.send("maximize-window");
    }
    
    function close(){
        ipcRenderer.send("close-window");
    }

    return (
        <div className="titleBar">
            <div className='actions'>
                <div className='action'>
                    <FontAwesomeIcon icon={faMinus} onClick={ () => miminize() } />
                </div>  
                <div className='action square'>
                    <FontAwesomeIcon icon={faSquare} onClick={ () => maximize() } />
                </div> 
                <div className='action cross'>
                    <FontAwesomeIcon icon={faX} onClick={ () => close() } />
                </div> 
            </div>
        </div>
    )

}