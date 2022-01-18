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
            document.getElementById(location.pathname.substring(1) + "-nb").classList.add('active');
        }
    }, [location]);  

    return(
        <div className="navbar">
            
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
    );

    
    

}