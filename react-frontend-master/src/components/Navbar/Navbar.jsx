import { faCog, faDollarSign, faHome, faInfoCircle, faPlus, faServer } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import { Link , useLocation } from 'react-router-dom';
import './Navbar.scss';

export default function Navbar() {

    const location = useLocation();

    useEffect(()=>{
        if(window.readyState = "interactive"){
            if(document.getElementsByClassName('active')[0] != undefined){
                document.getElementsByClassName('active')[0].classList.remove('active');
            }
            if(location.pathname.slice(0,7) == "/server"){
                document.getElementById("servers-nb").classList.add('active');
            }
            else{
                document.getElementById(location.pathname.substring(1) + "-nb").classList.add('active');
            }
            if(location.pathname == "/server" || location.pathname == "/server/"){
                window.location = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + "/servers";
            }
        }
    }, [location]);  

    return(
        <div className="navbar">

            <div className="navbar-overflow">

                <Link to={{pathname:"/dashboard"}} className="main-logo">MsM</Link>

                <div className="navbar-group">
                    <Link to={{pathname:"/dashboard"}} id='dashboard-nb'><FontAwesomeIcon icon={faHome}/> Dashboard</Link>
                </div>   

                <div className="navbar-group">
                    <div className="button" tabindex="1">
                        <p><FontAwesomeIcon icon={faPlus}/>Create</p>
                    </div>

                    <Link to={{pathname:"/servers"}} id='servers-nb'><FontAwesomeIcon icon={faServer}/> Servers</Link>

                </div>   

                <div className="navbar-group">
                    <Link to={{pathname:"/preferences"}} id='preferences-nb'><FontAwesomeIcon icon={faCog}/> Preferences</Link>
                </div>     

                <div className="navbar-group">
                    <Link to={{pathname:"/about"}} id='about-nb'><FontAwesomeIcon icon={faInfoCircle}/> About</Link>
                    <p><FontAwesomeIcon icon={faDollarSign}/> Donate</p>
                </div>  

            </div>        
        </div>
    );
}