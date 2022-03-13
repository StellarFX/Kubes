import React from 'react';
import { useParams } from "react-router-dom";
import './ServNavbar.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTerminal, faCog, faUser, faList, faFolder, faChartColumn } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useEffect } from "react";

export default function ServNavbar(props) {

    

    const { id } = useParams();

    useEffect(() => {
        if(document.getElementsByClassName('serv-active')[0] !== undefined){
            document.getElementsByClassName('serv-active')[0].classList.remove('serv-active');
        }
        if(document.getElementById(props.config+"-snb") !== undefined){
            document.getElementById(props.config+"-snb").classList.add('serv-active');
        }
        else{
            window.location = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + "/server/" + id + "/console";
        }
    }, [props.config]);

    // Joe mama 

    return(
        <div className="serv-navbar">
            <Link to={{pathname:`/server/${id}/console`}} id="console-snb" className='serv-active'><FontAwesomeIcon icon={faTerminal}/><p>Console</p></Link>
            <Link to={{pathname:`/server/${id}/configuration`}} id="configuration-snb"><FontAwesomeIcon icon={faCog}/><p>Configuration</p></Link>
            <Link to={{pathname:`/server/${id}/players`}} id="players-snb"><FontAwesomeIcon icon={faUser}/><p>Players</p></Link>
            <Link to={{pathname:`/server/${id}/whitelist`}} id="whitelist-snb"><FontAwesomeIcon icon={faList}/><p>Whitelist</p></Link>
            <Link to={{pathname:`/server/${id}/files`}} id="files-snb"><FontAwesomeIcon icon={faFolder}/><p>Files</p></Link>
            <Link to={{pathname:`/server/${id}/performances`}} id="performances-snb"><FontAwesomeIcon icon={faChartColumn}/><p>Performances</p></Link>
        </div>
    );

};