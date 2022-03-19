import React , { useState } from 'react';
import './TitleBar.scss';
import { faMinus, faX } from '@fortawesome/free-solid-svg-icons';
import { faSquare } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const { ipcRenderer } = window.require('electron');

export default function TitleBar() {

    const [Style, setStyle] = useState("1.8rem");

    function miminize(){
        ipcRenderer.send("minimize-window");
    }
    
    async function maximize(){
        let status = await ipcRenderer.invoke("maximize-window");
        let main = document.getElementById("main");

        if(status == true){
            main.style.borderRadius = "0px";
            setStyle("0rem");
        }
        else{
            main.style.borderRadius = "30px";
            setStyle("1.8rem");
        }

        console.log(main, status);
    }
    
    function close(){
        ipcRenderer.send("close-window");
    }

    return (
        <div className="titleBar">
            <div className='actions' style={{marginRight: Style}}>
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