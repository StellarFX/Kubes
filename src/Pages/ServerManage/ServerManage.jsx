import { 
    useParams,
    Routes,
    Route,
    useLocation,
    useNavigate
} from "react-router-dom";
import React,  {useEffect, useState} from 'react';
import './ServerManage.scss';
import ServNavbar from '../../components/ServNavbar/ServNavbar.jsx';

import Console from '../Servs-Configs/Console/Console';
import Configuration from '../Servs-Configs/Configuration/Configuration';
import Performances from '../Servs-Configs/Performances/Performances';
import Players from '../Servs-Configs/Players/Players';
import Whitelist from '../Servs-Configs/Whitelist/Whitelist';
import FileManager from '../../components/FileManager/FileManager';
import DeletePopup from "../../components/DeletePopup/DeletePopup";

import { faCheck, faTimes, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dialog } from '@mantine/core';

const { ipcRenderer } = window.require('electron');

function ServerManage(){

    const { id } = useParams();

    const [status, setStatus] = useState(0);
    const online = <div className="serv-status-online"><FontAwesomeIcon className='status-icon' icon={faCheck}/><p>Online</p></div>;
    const offline = <div className="serv-status-offline"><FontAwesomeIcon className='status-icon' icon={faTimes}/><p>Offline</p></div>;
    const starting = <div className="serv-status-starting"><FontAwesomeIcon className='status-icon' icon={faEllipsisH}/><p>Starting</p></div>;
    const loading = <div className="serv-status-restarting"><FontAwesomeIcon className='status-icon' icon={faEllipsisH}/><p>Restarting</p></div>;
    const stopping = <div className="serv-status-stopping"><FontAwesomeIcon className='status-icon' icon={faTimes}/><p>Stopping</p></div>;
    const statusChanger = [offline, online, starting, loading, stopping];

    const [customDialogOpened, setCustomDialogOpened] = useState(false);
    const [customDialogStyle, setCustomDialogStyle] = useState({});
    const [customDialogContent, setCustomDialogContent] = useState("");
    
    const location = decodeURI(useLocation().pathname).replaceAll("/", "").substring(6 +id.length);
    const navigate = useNavigate();

    const [port, setPort] = useState();
    const [version, setVersion] = useState();
    const [api, setApi] = useState();

    const [servPath, setServPath] = useState("");

    const [openWindow, setOpenWindow] = useState(false);
    

    useEffect(async()=>{
        let path = await ipcRenderer.invoke("scan-server-path", id);
        setServPath(path);
        let init = await ipcRenderer.invoke('get-activity', path);
        setStatus(init);
    },[]);

    async function removeServer(){
        let resp = await ipcRenderer.invoke("remove", servPath);
        if(resp === "success" && status === 0){
            navigate("/dashboard");
        }
    }

    function toggleDialog(content, style, toggle = !customDialogOpened) {
        setCustomDialogStyle(style);
        setCustomDialogContent(content);
        setCustomDialogOpened(toggle);
    }

    useEffect(()=>{
        ipcRenderer.on('error-starting-server', (e,err)=>{
            toggleDialog(<><FontAwesomeIcon style={{fontSize: "1.5rem"}}icon={faTimes} /><p>{err}</p></>, {root: {color: "white", zIndex: "9999",backgroundColor: "var(--red)", borderColor: "#4a0a0a"}, closeButton: { color: "white", "&:hover": { backgroundColor: "#ff3636" }}}, true);
            ipcRenderer.removeAllListeners();
        });

        ipcRenderer.on('closed-server', (e, path)=>{
            if(path === servPath && status === 4){
                setStatus(0);
                ipcRenderer.removeAllListeners();
            }
        });
        
        ipcRenderer.on('started-server', (e, path)=>{
            if(path === servPath){
                setStatus(1);
                ipcRenderer.removeAllListeners();
            }
        });

        ipcRenderer.on('changed-port', (e,port)=>{
            setPort(port);
            ipcRenderer.removeAllListeners();
        });
    },[status]);

    return(
        <>
        {openWindow === true ? 
        
            <DeletePopup name={id} delete={removeServer} close={()=>{setOpenWindow(false)}}/>

            :

            <></>

        }
        <div className='page-main-container'>
            <div className='page-title-container'>
                <p className='page-title'>{id}</p>
                {statusChanger[status]}
                <p className="remove-server" onClick={()=>{setOpenWindow(true)}}>Remove server</p>
            </div>
            <div className='page-content' id="servmanage-content">
                <ServNavbar config={location}/>
                <div className="config-container">
                    <p className="config-name">{location.charAt(0).toUpperCase() + location.slice(1)}</p> 
                    <Routes>
                        <Route path="/console" element={
                            <Console 
                            path={servPath} 
                            api={api} 
                            setApi={setApi} 
                            version={version} setVersion={setVersion} 
                            port={port} 
                            setPort={setPort} 
                            status={(num)=>setStatus(num)} 
                            stat={status}/>
                        }/>

                        <Route path="/configuration" element={<Configuration path={servPath}/>}/>
                        <Route path="/players" element={<Players path={servPath}/>}/>
                        <Route path="/whitelist" element={<Whitelist path={servPath}/>}/>
                        <Route path="/files" element={<FileManager server={id} path={servPath}/>}/>
                        <Route path="/performances" element={<Performances path={servPath}/> }/>
                    </Routes>
                </div>
            </div>
            <Dialog className="customDialog" styles={customDialogStyle} opened={customDialogOpened} onClose={() => setCustomDialogOpened(false)} withCloseButton size="lg" radius="md">
              <div className="customDialog-content">
                {customDialogContent}
              </div>
            </Dialog>
        </div>
        </>
    )

}

export default ServerManage;