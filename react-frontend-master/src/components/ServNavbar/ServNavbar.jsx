import { render } from "@testing-library/react";
import React from 'react';
import { useParams } from "react-router-dom";
import './ServNavbar.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTerminal, faCog, faUser, faList, faFolder, faChartBar } from '@fortawesome/free-solid-svg-icons';
import { Link , useLocation } from 'react-router-dom';
import { useEffect } from "react";

export default function ServNavbar(props) {

    const { config } = useParams();
    const {id} = useParams();

    useEffect(()=>{
        if(window.readyState = "interactive"){
            if(document.getElementsByClassName('serv-active')[0] != undefined){
                document.getElementsByClassName('serv-active')[0].classList.remove('serv-active');
            }
            document.getElementById(config+"-snb").classList.add('serv-active');
        }
    }, [config]); 

    return(
        <div className="serv-navbar">
            <Link to={{pathname:`/server/${id}/console`}} id="console-snb"><FontAwesomeIcon icon={faTerminal}/>Console</Link>
            <Link to={{pathname:`/server/${id}/configuration`}} id="configuration-snb"><FontAwesomeIcon icon={faCog}/>Configuration</Link>
            <Link to={{pathname:`/server/${id}/players`}} id="players-snb"><FontAwesomeIcon icon={faUser}/>Players</Link>
            <Link to={{pathname:`/server/${id}/whitelist`}} id="whitelist-snb"><FontAwesomeIcon icon={faList}/>Whitelist</Link>
            <Link to={{pathname:`/server/${id}/files`}} id="files-snb"><FontAwesomeIcon icon={faFolder}/>Files</Link>
            <Link to={{pathname:`/server/${id}/usage`}} id="usage-snb"><FontAwesomeIcon icon={faChartBar}/>Usage</Link>
        </div>
    );

};