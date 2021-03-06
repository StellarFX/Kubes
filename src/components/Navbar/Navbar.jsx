import { faCog, faDollarSign, faHome, faInfoCircle, faPlus, faServer } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Link , useLocation, useNavigate } from 'react-router-dom';
import './Navbar.scss';
import Create from "../Create/Create";
import LogoFull from '../../public/Logo-Full.png';

export default function Navbar() {

    const location = useLocation();
    const navigate = useNavigate();
    const [createOpen, setCreateOpen] = useState(false);

    useEffect(() => {
        if(document.getElementsByClassName('active')[0] !== undefined){
            document.getElementsByClassName('active')[0].classList.remove('active');
        }
        if(location.pathname.slice(0,7) === "/server"){
            document.getElementById("servers-nb").classList.add('active');
            addComplete("servers-nb");
        }
        else{
            document.getElementById(location.pathname.substring(1) + "-nb")?.classList?.add('active');
            addComplete(location.pathname.substring(1) + "-nb");
        }
        if(location.pathname === "/server" || location.pathname === "/server/"){
            window.location = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + "/servers";
        }
    }, [location]);  

    function addComplete(name){
        setTimeout(() => {
            document.getElementsByClassName("completed")[0]?.classList.remove('completed');
            document.getElementById(name).classList.add('completed');
        }, 200);
    }

    return(
        <div className="navbar">

            {createOpen ? <Create open={createOpen} setOpen={setCreateOpen}/> : ""}

            <div className="navbar-overflow">

                <div className="logo-nb">
                    <img src={LogoFull} className="icon"/>
                    <p>Kubes</p>
                </div>

                <div className="navbar-group">
                    <Link to={{pathname:"/dashboard"}} id='dashboard-nb'><FontAwesomeIcon icon={faHome}/> Dashboard</Link>
                </div>   

                <div className="navbar-group">
                    <div className="button" tabIndex="1" onClick={() => {setCreateOpen(!createOpen);navigate('/dashboard')}}>
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