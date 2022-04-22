import React , { useState } from 'react';
import "./Console.scss";
import { faPowerOff, faRedoAlt, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Terminal from '../../../components/Terminal/terminal';
import { useLocation } from 'react-router-dom';

const { ipcRenderer } = window.require("electron");

export default function Console(props){
    const location = useLocation();
    const [port, setPort] = useState();
    const [init, setInit] = useState(false);
    if(!init){
        if(location.search.substring(1)!==""){
            props.setPort(location.search.substring(1));
            setPort(location.search.substring(1));
        }
        else{
            setPort(props.port);
        }
        setInit(true);
    }
    
    function start(){
        props.status(2);
        ipcRenderer.send('start-server', props.path);
    }

    function restart(){
        if(props.stat === 1){
            props.status(3);
            ipcRenderer.send('restart-server', props.path);
        }
    }

    function stop(){
        ipcRenderer.send('stop-server', props.path);
    }

    return(
        <div className="console-main-container">
            <div className="console-container">
                <Terminal/>
            </div>

            <div className="console-bottom">
                <div className="console-actions">
                    <p className="console-bottom-title">Actions</p>
                    <div className="actions-container">
                        <div className="start-server" onClick={()=>start()}>
                            <p><FontAwesomeIcon icon={faPowerOff}/>Start</p>
                        </div>
                        <div className="restart-server" onClick={()=>restart()}>
                            <p><FontAwesomeIcon icon={faRedoAlt}/>Restart</p>
                        </div>
                        <div className="stop-server" onClick={()=>stop()}>
                            <p><FontAwesomeIcon icon={faTimes}/>Stop</p>
                        </div>
                    </div>
                </div>
                <div className="console-properties">
                    <p className="console-bottom-title">Properties</p>
                    <div className="properties-container">
                        <div className="p-left">
                            <p>Users online:</p>
                            <p>Version:</p>
                            <p>Port:</p>
                        </div>
                        <div className="p-right">
                            <p>0/50</p>
                            <p>Spigot 1.12.2</p>
                            <p>{port}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}