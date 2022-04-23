import React , { useState , useEffect } from 'react';
import './TitleBar.scss';
import { faMinus, faX } from '@fortawesome/free-solid-svg-icons';
import { faSquare } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const { ipcRenderer } = window.require('electron');

export default function TitleBar() {

    const [Style, setStyle] = useState("1.8rem");
    const [Drag, setDrag] = useState("drag");
    const [winStat, setWinStat] = useState();

    const [init, setInit] = useState(false);

    useEffect(()=>{
        let main = document.getElementById("main");
        if(winStat){
            main.style.borderRadius = "0px";
            setStyle("0rem");
            setDrag("no-drag");
        }
        else{
            main.style.borderRadius = "30px";
            setStyle("1.8rem");
            setDrag("drag");
        }
    },[winStat]);

    async function Init(){
        let resp = await ipcRenderer.invoke('window-stat');
        setWinStat(resp);
    }

    if(!init){
        Init();
        setInit(true);
    }

    function miminize(){
        ipcRenderer.send("minimize-window");
    }
    
    async function maximize(){
        let status = await ipcRenderer.invoke("maximize-window");
        setWinStat(status);
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