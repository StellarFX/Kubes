import { 
    useParams,
    Routes,
    Route,
    useLocation} from "react-router-dom";
import {
    
  } from "react-router-dom";
import React from 'react';
import './ServerManage.scss';
import ServNavbar from '../../components/ServNavbar/ServNavbar.jsx';

import Console from '../Servs-Configs/Console/Console';
import Configuration from '../Servs-Configs/Configuration/Configuration';
import Performances from '../Servs-Configs/Performances/Performances';
import Players from '../Servs-Configs/Players/Players';
import Whitelist from '../Servs-Configs/Whitelist/Whitelist';
import FileManager from '../../components/FileManager/FileManager';

function ServerManage(){

    const { id } = useParams();

    const location = useLocation().pathname.replaceAll("/", "").substring(6 +id.length);

    return(
        <div className='page-main-container'>
            <div className='page-title-container'>
                <p className='page-title'>{id}</p>
            </div>
            <div className='page-content' id="servmanage-content">
                <ServNavbar config={location}/>
                <div className="config-container">
                    <p className="config-name">{location.charAt(0).toUpperCase() + location.slice(1)}</p> 
                    <Routes>
                        <Route path="/console" element={<Console/>}/>
                        <Route path="/configuration" element={<Configuration/>}/>
                        <Route path="/players" element={<Players/>}/>
                        <Route path="/whitelist" element={<Whitelist/>}/>
                        <Route path="/files" element={<FileManager server={id} />}/>
                        <Route path="/performances" element={<Performances/>}/>
                    </Routes>
                </div>
            </div>
        </div>
    )

}

export default ServerManage;