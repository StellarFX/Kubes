import React , { useState } from 'react';
import './TitleBar.scss';
import { faMinus, faX } from '@fortawesome/free-solid-svg-icons';
import { faSquare } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const { ipcRenderer } = window.require('electron');

export default function TitleBar() {

    const [Style, setStyle] = useState("1.8rem");
    const [Drag, setDrag] = useState("drag");

    function miminize(){
        ipcRenderer.send("minimize-window");
    }
    
    async function maximize(){
        let status = await ipcRenderer.invoke("maximize-window");
        let main = document.getElementById("main");

        if(status === true){
            main.style.borderRadius = "0px";
            setStyle("0rem");
            setDrag("no-drag");
        }
        else{
            main.style.borderRadius = "30px";
            setStyle("1.8rem");
            setDrag("drag");
        }
    }
    
    function close(){
        ipcRenderer.send("close-window");
    }

    return (
        <div className="titleBar" style={{WebkitAppRegion: Drag}}>
            <div className='actions' style={{marginRight: Style}}>
                <div className='action' onClick={ () => miminize() }>
                    <FontAwesomeIcon icon={faMinus}/>
                </div>  
                <div className='action square' onClick={ () => maximize()}>
                    <FontAwesomeIcon icon={faSquare}/>
                </div> 
                <div className='action cross' onClick={ () => close() }>
                    <FontAwesomeIcon icon={faX}/>
                </div> 
            </div>
        </div>
    )

}