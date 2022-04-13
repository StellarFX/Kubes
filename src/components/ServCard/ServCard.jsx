import { faCheck, faTimes, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ServCard.scss';

const { ipcRenderer } = window.require('electron');

export default function ServCard(props) {

    // ------------------------------ <Essentials ------------------------------

    const [Status, setStatus] = useState(parseInt(props.status)); // 0: Offline -- 1: Online -- 2: Starting -- 3: Loading -- 4: Empty
    const Version = "Spigot 1.12.2";
    const Port = "25250";
    const onlineUsers = 0;
    const availablePlaces = 50;
    const [Name, setName] = useState(props.name);
    const [directory, setDirectory] = useState(props.dir);

    // ------------------------------ Essentials> ------------------------------

    // ----------------- <Title -----------------

    async function sendRename(value, dir, name){
        ipcRenderer.send('rename-server', {'Newname':value, 'Oldname': name, 'path': dir});

        setDirectory(dir.slice(0, dir.length-name.length).concat(value));
        setName(value);
        setSelector(0);
        Inputed = false;
        setPlaceHolder("Enter a name...");
        setHolderValue("card-name-input-1");
         return "renamed";
        
    }

    function inputResponse(e){
        let Value = e.target.value.replaceAll(" ", "");
        const rg1 = /^[^\\\/\:\"\?\<\>\|]+$/i;
        if(e.key === 'Enter'){
            if(rg1.test(Value) && document.getElementById(e.target.value) === undefined && Value.length <= 35){
                sendRename(e.target.value, directory, Name);
            }
            else{
                if(!rg1.test(Value)){
                    setPlaceHolder("Please enter a valid name.");
                }
                if(document.getElementById(e.target.value) != undefined){
                    setPlaceHolder("Name already used.");
                }
                if(Value.length >35){
                    setPlaceHolder("Too long.");
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
    const loading = <div className="serv-status-starting"><FontAwesomeIcon className='status-icon' icon={faEllipsisH}/><p>Loading</p></div>;
    const empty = <div className="serv-status-empty"><FontAwesomeIcon className='status-icon' icon={faTimes}/><p>Empty</p></div>;
    const statusChanger = [offline, online, starting, loading, empty];

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

            <Link to={{pathname:`/server/${Name}/console`}}className="manage-button" tabIndex="1">
                <p>Manage</p>
            </Link>
        </div>
    );

}