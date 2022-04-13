import React, { useState } from 'react';
import ServCard from '../../components/ServCard/ServCard.jsx';
import './Servers.scss';

const { ipcRenderer } = window.require('electron');

function Servers(){

    const [initialized, setInitialized] = useState(false);
    const [folderPath, setFolderPath] = useState("");
    const [ServersList, setServersList] = useState([]);
    const items = ServersList.map((serv)=>{

        return(
            <>
                <ServCard status="1" name={serv["name"]} dir={serv["path"]}/>
            </>
        )

    });

    async function InitializePath() {

        let path = await ipcRenderer.invoke("initialize-path");
        setFolderPath(path);
        setInitialized(true);
        scanServers();
    };

    async function scanServers(){
        let list = await ipcRenderer.invoke("scan-servers");
        setServersList(list);
    }

    if(initialized === false){
        InitializePath();
    }


    return(
        <div className='page-main-container'>
            <div className='page-title-container'>
                <p className='page-title'>Servers</p>
                <p className='text'>Folder path:</p>
                <p className='folder-path'>{folderPath}</p>
            </div>
            <div className='page-content' id="servers-content">
                { items.length > 0 ? 
                
                <div className='servers-grid'>
                    {items}
                </div>
                
                :
                
                <p className='no-servs'>There are no servers here.</p>
                
                }
            </div>
        </div>
    );
}

export default Servers;