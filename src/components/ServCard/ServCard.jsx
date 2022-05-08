import { faCheck, faTimes, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ServCard.scss';

const { ipcRenderer } = window.require('electron');

export default function ServCard(props) {

    // ------------------------------ <Essentials ------------------------------

    const [Status, setStatus] = useState(parseInt(props.status)); // 0: Offline -- 1: Online -- 2: Starting -- 3: Restarting -- 4: Stopping
    const Version = props.api + ' ' + props.version;
    const Port = props.port;
    const onlineUsers = 0;
    const availablePlaces = props.maxPlayers;
    const [Name, setName] = useState(props.name);
    const [directory, setDirectory] = useState(props.dir);

    // ------------------------------ Essentials> ------------------------------

    // ----------------- <Title -----------------

    async function sendRename(value, dir, name){
        console.log('bon');
        setDirectory(dir.slice(0, dir.length-name.length).concat(value));
        setName(value);
        setSelector(0);
        Inputed = false;
        setPlaceHolder("Enter a name...");
        setHolderValue("card-name-input-1");
         return "renamed";
        
    }

    async function inputResponse(e){
        if(e.key === 'Enter'){
            let Value = e.target.value.replaceAll(" ", "");
            const rg1 = /^[^\\/:"?<>|]+$/i;
            let resp;
            if(rg1.test(Value) && Value.length <= 35 && parseInt(props.status) === 0){
                resp = await ipcRenderer.invoke('rename-server', {'Newname':e.target.value, 'Oldname': Name, 'path': directory});
                if(resp === 'success'){
                    sendRename(e.target.value, directory, Name);
                }
                else if(resp === 'exists'){
                    e.target.value = "";
                    setPlaceHolder("Already used.");
                    setHolderValue("card-name-input-2");
                }
            }
            else{
                if(!rg1.test(Value)){
                    setPlaceHolder("Please enter a valid name.");
                }
                if(Value.length >35){
                    setPlaceHolder("Too long.");
                }
                if(parseInt(props.status) !== 0){
                    setPlaceHolder("Server is running.");
                }
                
                e.target.value = "";
                setHolderValue("card-name-input-2");
            }
        }
        if(e.key === "Escape"){
            setSelector(0);
            Inputed = false;
            setPlaceHolder("Enter a name...");
            setHolderValue("card-name-input-1");
        }
    }

    const [displaying, setDisplay] = useState("flex");

    function setInput(){
        setDisplay("initial");
        setSelector(1);
        Inputed = true;
    }

    function clicking(){
        let container = document.getElementById(Name);
        
        if(Inputed === true && container != undefined){

            if(container.childNodes[0].className === holderValue && document.activeElement != container.childNodes[0]){
                setSelector(0);
                setPlaceHolder("Enter a name...");
                setHolderValue("card-name-input-1");
            }
        }
    }

    window.addEventListener('click', ()=>{
        clicking();
    });

    var Inputed = false;

    const [selector,setSelector] = useState(0); // 0: Affiche le titre -- 1: Affiche l'input pour le titre

    const [holderValue, setHolderValue] = useState("card-name-input-1");
    const [placeHolder, setPlaceHolder] = useState("Enter a name...");

    const p = <p className="card-name" onClick={()=>{setInput()}} id={Name}>{Name}</p>;
    const input= <input type="text" className={holderValue} placeholder={placeHolder} onKeyDown={(event) => inputResponse(event)} autoFocus></input>;
    const doms = [p, input];

    // ----------------- Title> -----------------

    // ----------------- <Status -----------------

    const online = <div className="serv-status-online"><FontAwesomeIcon className='status-icon' icon={faCheck}/><p>Online</p></div>;
    const offline = <div className="serv-status-offline"><FontAwesomeIcon className='status-icon' icon={faTimes}/><p>Offline</p></div>;
    const starting = <div className="serv-status-starting"><FontAwesomeIcon className='status-icon' icon={faEllipsisH}/><p>Starting</p></div>;
    const loading = <div className="serv-status-restarting"><FontAwesomeIcon className='status-icon' icon={faEllipsisH}/><p>Restarting</p></div>;
    const stopping = <div className="serv-status-stopping"><FontAwesomeIcon className='status-icon' icon={faTimes}/><p>Stopping</p></div>;
    const statusChanger = [offline, online, starting, loading, stopping];

    // ----------------- Status> -----------------

    

    

    // ------------------------------------------ <HTML PART> ------------------------------------------



    return (
        <div className="serv-card">

            <div className="card-title-container">

                <div className='name-container' id={Name} style={{display: displaying}}>
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

            <Link to={{pathname:`/server/${Name}/console`, search: props.port}} state={{version: props.version, api: props.api, port: props.port, maxPlayers: props.maxPlayers}} className="manage-button" tabIndex="1">
                <p>Manage</p>
            </Link>
        </div>
    );

}