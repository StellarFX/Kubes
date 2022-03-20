import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import "./Whadis.scss";
import Logo from "../../public/Logo (1).svg"

export default function Whadis() {

    return (
        <div className="whadis-container" id='wc'>
            <div className="title-container">
                <img src={Logo} className="title-icon"/>
                <p className="title">Welcome to Kubes!</p>
            </div>
            <div className="main-text-container">
                <p className="whadis">What is Kubes? <br/> <br/>Kubes is a manager for Minecraft local servers.<br/>This software is here in order to make the setup of your servers easier
                and shorter, therefore to make you have a better experience on the game.<br/> <br/> Kubes has been developped by two students in high school, and is moreover their first
                software. We hope this will satisfy you and wish you a good experience!</p>
            </div>
        </div>
    );
}