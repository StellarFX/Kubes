import React, { useState, useEffect } from 'react';
import ServCard from '../../components/ServCard/ServCard.jsx';
import './Servers.scss';
import { useListState } from '@mantine/hooks';
import Create from '../../components/Create/Create';
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation } from "react-router-dom";

const { ipcRenderer } = window.require('electron');

var items;

function Servers(){

    const location = useLocation();
    
    const [openCreate, setOpenCreate] = useState(false);

    useEffect(async()=>{
        let path = await ipcRenderer.invoke("initialize-path");
        setFolderPath(path);
        scanServers();
        
    },[]);

    useEffect(()=>{
        ipcRenderer.removeAllListeners();
    });

    const [folderPath, setFolderPath] = useState("");
    const [serversList, serversListHandler] = useListState([]);
    const [scanned, setScanned] = useState(false);

    items = serversList.sort((a,b)=>{
        if([1,2,3].includes(parseInt(a['status']))){
            return -1;
        }
        else if([1,2,3].includes(parseInt(b['status']))){
            return 1;
        }
        else{
            return 0;
        }
    }).map((serv)=>{
        return(
            <>
                <ServCard status={serv['status']} api={serv['api']} name={serv["name"]} dir={serv["path"]} version={serv['version']} port={serv['port']} key={serv['status']}/>
            </>
        )

    });

    async function scanServers(){
        let list = await ipcRenderer.invoke("scan-servers");
        for(let i = 0; i < list.length; i++){
            let resp = await ipcRenderer.invoke('get-activity', list[i]['path']);
            list[i]['status'] = resp;
        }
        serversListHandler.setState(list);
        setScanned(true);
    }

    ipcRenderer.on('closed-server', (e, path)=>{

        for(let i = 0; i < serversList.length; i++){
            if(serversList[i]['path'] === path){
                serversListHandler.setItemProp(i, 'status', 0);
            }
        }
    });

    ipcRenderer.on('started-server', (e, path)=>{
        for(let i = 0; i < serversList.length; i++){
            if(serversList[i]['path'] === path){
                serversListHandler.setItemProp(i, 'status', 1);
            }
        }
    });

    return(
        <div className='page-main-container'>
            {openCreate? <Create open={openCreate} setOpen={setOpenCreate}/> : ""}
            <div className='page-title-container'>
                <p className='page-title'>Servers</p>
                <p className='text'>Folder path:</p>
                <p className='folder-path'>{folderPath}</p>
            </div>
            <div className='page-content' id="servers-content">
                {items.length > 0 ? 
                
                <div className='servers-grid'>
                    {items}
                </div>
                
                :

                scanned ?
                
                <div className='no-servers'>
                    <p className='no-servs'>There are no servers here.</p>
                    <p className='click-here'>Click here to create one:</p>
                    <div className="button" tabIndex="1" onClick={() => setOpenCreate(!openCreate)}>
                        <p><FontAwesomeIcon icon={faPlus}/>Create</p>
                    </div>
                    
                </div>

                :

                <></>
                
                }
            </div>
        </div>
    );
}

export default Servers;