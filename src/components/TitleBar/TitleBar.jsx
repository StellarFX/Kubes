import React from 'react';
import './TitleBar.scss';
import { faMinus, faX } from '@fortawesome/free-solid-svg-icons';
import { faSquare } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BrowserWindow } from 'electron';

export default function TitleBar() {
    /*const win = remote.getCurrentWindow();

    function miminize(){
        win.miminize();
    }
    
    function maximize(){
    
    }
    
    function close(){
    
    }*/

    return (
        <div className="titleBar">
            <div className='actions'>
                <div className='action'>
                    <FontAwesomeIcon icon={faMinus} /*onClick={()=>miminize()}*//>
                </div>  
                <div className='action square'>
                    <FontAwesomeIcon icon={faSquare}/>
                </div> 
                <div className='action cross'>
                    <FontAwesomeIcon icon={faX}/>
                </div> 
            </div>
        </div>
    )

}