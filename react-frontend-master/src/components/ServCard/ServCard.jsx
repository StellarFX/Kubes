import { faCheck, faTimes, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import './ServCard.scss';

export default function ServCard(props) {

    // ------------------------------ <Essentials ------------------------------

    const [Status, setStatus] = useState(1); // 0: Offline -- 1: Online -- 2: Starting -- 3: Loading -- 4: Empty
    const Version = "Spigot 1.12.2";
    const Port = "25250";
    const onlineUsers = 0;
    const availablePlaces = 50;

    // ------------------------------ Essentials> ------------------------------

    // ----------------- <Title -----------------

    function inputResponse(e){
        let Value = e.target.value.replaceAll(" ", "");
        if(e.key === 'Enter'){
            if(Value.length >= 1){
                setName(e.target.value);
                setSelector(selector - 1);
                setPlaceHolder("Enter a name...");
                setHolderValue("card-name-input-1");
            }
            else{
                setPlaceHolder("Please enter a valid name.");
                setHolderValue("card-name-input-2");
            }
        }
    }

    const [selector,setSelector] = useState(0); // 0: Affiche le titre -- 1: Affiche l'input pour le titre


    const [holderValue, setHolderValue] = useState("card-name-input-1");
    const [placeHolder, setPlaceHolder] = useState("Enter a name...");
    const [Name, setName] = useState("Minecraft Server");

    const p = <p className="card-name" onClick={(event) => setSelector(selector + 1)}>{Name}</p>;
    const input= <input type="text" className={holderValue} placeholder={placeHolder} onKeyDown={(event) => inputResponse(event)} autoFocus></input>;
    const doms = [p, input];

    // ----------------- Title> -----------------

    // ----------------- <Status -----------------

    const online = <div className="serv-status-online"><FontAwesomeIcon className='status-icon' icon={faCheck}/><p>Online</p></div>;
    const offline = <div className="serv-status-offline"><FontAwesomeIcon className='status-icon' icon={faTimes}/><p>Offline</p></div>;
    const starting = <div className="serv-status-starting"><FontAwesomeIcon className='status-icon' icon={faEllipsisH}/><p>Starting</p></div>;
    const loading = <div className="serv-status-starting"><FontAwesomeIcon className='status-icon' icon={faEllipsisH}/><p>Loading</p></div>;
    const empty = <div className="serv-status-empty"><FontAwesomeIcon className='status-icon' icon={faTimes}/><p>Empty</p></div>;
    const statusChanger = [offline, online, starting, loading, empty];

    // ----------------- Status> -----------------

    

    // ------------------------------------------ <HTML PART> ------------------------------------------



    return (
        <div className="serv-card" id={Name}>

            <div className="card-title-container">

                <div className='name-container' >
                    {doms[selector]}
                </div>

                {statusChanger[Status]}

            </div>

            <div className="card-properties">
                <div className="left">
                    <p>Users online:</p>
                    <p>Version:</p>
                    <p>Port:</p>
                </div>
                <div className="right">
                    <p>{onlineUsers}/{availablePlaces}</p>
                    <p>{Version}</p>
                    <p>{Port}</p>
                </div>
                
            </div>

            <div className="manage-button" tabindex="1">
                <p>Manage</p>
            </div>
        </div>
    );

}