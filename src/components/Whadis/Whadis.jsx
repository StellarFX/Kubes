import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import "./Whadis.scss";

export default function Whadis() {

    return (
        <div className="whadis-container" id='wc'>
            <div className="title-container">
                <FontAwesomeIcon icon={faQuestion} className="title-icon"/>
                <p className="title">What is MsM</p>
            </div>
            <div className="main-text-container">
                <p className="whadis">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt 
                ut labore et dolore magna aliqua. <br/>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip 
                ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                 pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt 
                ut labore et dolore magna aliqua. Ut enim ad minim veniam, Ut enim ad minim veniam, Ut enim ad minim veniam,Ut enim ad minim veniam,Ut enim ad minim veniam,Ut enim ad minim veniam,Ut enim ad minim veniam,</p>
            </div>
        </div>
    );
}