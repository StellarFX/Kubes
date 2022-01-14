import { faCog, faDollarSign, faHome, faInfoCircle, faPlus, faServer } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import './Navbar.scss';

export default function Navbar() {

    return(
        <div className="navbar">

            <h1>Logo</h1>

            <div className="navbar-group">
                <p className="active"><FontAwesomeIcon icon={faHome}/> Dashboard</p>
            </div>   

            <div className="navbar-group">
                <div className="button">
                    <p><FontAwesomeIcon icon={faPlus}/>Create</p>
                </div>

                <p><FontAwesomeIcon icon={faServer}/> Servers</p>

            </div>   

            <div className="navbar-group">
                <p><FontAwesomeIcon icon={faCog}/> Preferences</p>
            </div>     

            <div className="navbar-group">
                <p><FontAwesomeIcon icon={faInfoCircle}/> About</p>
                <p><FontAwesomeIcon icon={faDollarSign}/> Donate</p>
            </div>     
        
        </div>
    );

}