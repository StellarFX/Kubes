import React from 'react';
import { useParams } from "react-router-dom";
import './ServNavbar.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTerminal, faCog, faUser, faList, faFolder, faChartBar } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useEffect } from "react";

export default function ServNavbar(props) {

    console.log(props.config);

    const { id } = useParams();

    useEffect(() => {
        if(window.readyState === "interactive"){
            if(document.getElementsByClassName('serv-active')[0] !== undefined){
                document.getElementsByClassName('serv-active')[0].classList.remove('serv-active');
            }
            if(document.getElementById(props.config+"-snb") !== undefined){
                document.getElementById(props.config+"-snb").classList.add('serv-active');
            }
            else{
                window.location = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + "/server/" + id + "/console";
            }
        }
    }, [props.config]);

    return(
        <div className="serv-navbar">
            <Link to={{pathname:`/server/${id}/console`}} id="console-snb"><FontAwesomeIcon icon={faTerminal}/>Console</Link>
            <Link to={{pathname:`/server/${id}/configuration`}} id="configuration-snb"><FontAwesomeIcon icon={faCog}/>Configuration</Link>
            <Link to={{pathname:`/server/${id}/players`}} id="players-snb"><FontAwesomeIcon icon={faUser}/>Players</Link>
            <Link to={{pathname:`/server/${id}/whitelist`}} id="whitelist-snb"><FontAwesomeIcon icon={faList}/>Whitelist</Link>
            <Link to={{pathname:`/server/${id}/files`}} id="files-snb"><FontAwesomeIcon icon={faFolder}/>Files</Link>
            <Link to={{pathname:`/server/${id}/performances`}} id="performances-snb"><FontAwesomeIcon icon={faChartBar}/>Performances</Link>
        </div>
    );

};