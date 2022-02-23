import { faCog, faDollarSign, faHome, faInfoCircle, faPlus, faServer } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Link , useLocation } from 'react-router-dom';
import './Navbar.scss';
import Create from "../Create/Create";

export default function Navbar() {

    const location = useLocation();
    const [createOpen, setCreateOpen] = useState(false);

    useEffect(() => {
        if(document.getElementsByClassName('active')[0] !== undefined){
            document.getElementsByClassName('active')[0].classList.remove('active');
        }
        if(location.pathname.slice(0,7) === "/server"){
            document.getElementById("servers-nb").classList.add('active');
            addComplete();
        }
        else{
            document.getElementById(location.pathname.substring(1) + "-nb")?.classList?.add('active');
            addComplete();
        }
        if(location.pathname === "/server" || location.pathname === "/server/"){
            window.location = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + "/servers";
        }
    }, [location]);  

    function addComplete(){
        setTimeout(() => {
            document.getElementsByClassName("completed")[0]?.classList.remove('completed');
            document.getElementsByClassName("active")[0].classList.add('completed');
        }, 100);
    }

    return(
        <div className="navbar">

            {createOpen ? <Create open={createOpen} setOpen={setCreateOpen}/> : ""}

            <div className="navbar-overflow">

                <div className="logo-nb">
                    <img src="/assets/Logo-Full.png" className="icon"/>
                    <p>Kubes</p>
                </div>

                <div className="navbar-group">
                    <Link to={{pathname:"/dashboard"}} id='dashboard-nb'><FontAwesomeIcon icon={faHome}/> Dashboard</Link>
                </div>   

                <div className="navbar-group">
                    <div className="button" tabindex="1" onClick={() => setCreateOpen(!createOpen)}>
                        <p><FontAwesomeIcon icon={faPlus}/>Create</p>
                    </div>

                    <Link to={{pathname:"/servers"}} id='servers-nb'><FontAwesomeIcon icon={faServer}/> Servers</Link>

                </div>   

                <div className="navbar-group">
                    <Link to={{pathname:"/preferences"}} id='preferences-nb'><FontAwesomeIcon icon={faCog}/> Preferences</Link>
                </div>     

                <div className="navbar-group">
                    <Link to={{pathname:"/about"}} id='about-nb'><FontAwesomeIcon icon={faInfoCircle}/> About</Link>
                    <Link to={{pathname:"/donate"}} id='donate-nb'><FontAwesomeIcon icon={faDollarSign}/> Donate</Link>
                </div>  

            </div>        
        </div>
    );
}