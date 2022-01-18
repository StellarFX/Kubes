import { faCheck, faTimes, faEllipsisH, faAmericanSignLanguageInterpreting } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Link , useLocation } from 'react-router-dom';
import './ServCard.scss';

export default function ServCard(props) {

    // ------------------------------ <Essentials ------------------------------

    const [Status, setStatus] = useState(parseInt(props.status)); // 0: Offline -- 1: Online -- 2: Starting -- 3: Loading -- 4: Empty
    const Version = "Spigot 1.12.2";
    const Port = "25250";
    const onlineUsers = 0;
    const availablePlaces = 50;
    const [Name, setName] = useState(JSON.stringify(Math.random() * 1000).replaceAll(".", "").slice(0,4));

    // ------------------------------ Essentials> ------------------------------

    // ----------------- <Title -----------------

    function inputResponse(e){
        let Value = e.target.value.replaceAll(" ", "");
        
        if(e.key === 'Enter'){
            if(Value.length >= 1 && document.getElementById(e.target.value) == undefined){
                setName(e.target.value);
                name = e.target.value;
                setSelector(0);
                Inputed = false;
                setPlaceHolder("Enter a name...");
                setHolderValue("card-name-input-1");
                setTimeout(()=> {
                    checkHeight(e.target.value);
                }, 100);
            }
            else{
                if(Value.length <1){
                    setPlaceHolder("Please enter a valid name.");
                }
                if(document.getElementById(e.target.value) != undefined){
                    setPlaceHolder("Name already used.");
                }
                
                e.target.value = "";
                setHolderValue("card-name-input-2");
            }
        }
    }

    function setInput(){
        setDots("");
        setDisplay("initial");
        setSelector(1);
        Inputed = true;
    }

    function clicking(){
        let container = document.getElementsByClassName('name-container');
        
        if(Inputed === true){

            for(let i = 0; i < container.length; i++){

                if(container[i].childNodes[0].className == holderValue && document.activeElement != container[i].childNodes[0]){
                    
                    setSelector(0);
                    setPlaceHolder("Enter a name...");
                    setHolderValue("card-name-input-1");
                }
            }
        }
    }

    window.addEventListener('click', ()=>{
        clicking();
    });

    function checkHeight(value){
        let card = document.getElementsByClassName('card-name');
        let cont = document.getElementById('snc');
        for(let i = 0; i < card.length; i++){
            if(card[i] === document.getElementById(value) && card[i].clientHeight > 60){
                setDots('...');
                setDisplay('flex');
            }
        }
    }

    var name = Name;
    var Inputed = false;

    const [selector,setSelector] = useState(0); // 0: Affiche le titre -- 1: Affiche l'input pour le titre

    const [holderValue, setHolderValue] = useState("card-name-input-1");
    const [placeHolder, setPlaceHolder] = useState("Enter a name...");

    const p = <p className="card-name" onClick={(event) => setInput()} id={Name}>{Name}</p>;
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

    const [dots, setDots] = useState("");
    const [displaying, setDisplay] = useState("flex");

    

    // ------------------------------------------ <HTML PART> ------------------------------------------



    return (
        <div className="serv-card">

            <div className="card-title-container">

                <div className='name-container' id="snc" style={{display: displaying}}>
                    {doms[selector]}
                    <p className='n-dots'>{dots}</p>
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

            <Link to={{pathname:`/server/${Name}`}}className="manage-button" tabindex="1">
                <p>Manage</p>
            </Link>
        </div>
    );

}