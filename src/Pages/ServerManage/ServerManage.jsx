import { 
    useParams,
    Routes,
    Route,
    useLocation,
    useNavigate
} from "react-router-dom";
import React,  {useState,useEffect} from 'react';
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

const { ipcRenderer } = window.require('electron');

function ServerManage(){

    const [status, setStatus] = useState(1);
    const online = <div className="serv-status-online"><FontAwesomeIcon className='status-icon' icon={faCheck}/><p>Online</p></div>;
    const offline = <div className="serv-status-offline"><FontAwesomeIcon className='status-icon' icon={faTimes}/><p>Offline</p></div>;
    const starting = <div className="serv-status-starting"><FontAwesomeIcon className='status-icon' icon={faEllipsisH}/><p>Starting</p></div>;
    const loading = <div className="serv-status-starting"><FontAwesomeIcon className='status-icon' icon={faEllipsisH}/><p>Loading</p></div>;
    const empty = <div className="serv-status-empty"><FontAwesomeIcon className='status-icon' icon={faTimes}/><p>Empty</p></div>;
    const statusChanger = [offline, online, starting, loading, empty];

    const { id } = useParams();
    const location = decodeURI(useLocation().pathname).replaceAll("/", "").substring(6 +id.length);
    const navigate = useNavigate();

    const [initialized, setInitialized] = useState(false);

    const [servPath, setServPath] = useState("");

    const [openWindow, setOpenWindow] = useState(false);

    async function scanPath() {
      let path = await ipcRenderer.invoke("scan-server-path", id);
      setServPath(path);
    };
  
    if(initialized === false){
      setInitialized(true);
      scanPath();
    }

    async function removeServer(){
        let resp = await ipcRenderer.invoke("remove", servPath);
        if(resp === "success"){
            navigate("/dashboard");
        }
    }

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
                        <Route path="/console" element={<Console/>}/>
                        <Route path="/configuration" element={<Configuration path={servPath}/>}/>
                        <Route path="/players" element={<Players path={servPath}/>}/>
                        <Route path="/whitelist" element={<Whitelist path={servPath}/>}/>
                        <Route path="/files" element={<FileManager server={id} path={servPath}/>}/>
                        <Route path="/performances" element={<Performances path={servPath}/> }/>
                    </Routes>
                </div>
            </div>
        </div>
        </>
    )

}

export default ServerManage;