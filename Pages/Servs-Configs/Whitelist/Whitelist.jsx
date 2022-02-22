import './Whitelist.scss';
import React, { useState } from 'react';
import { faPlusCircle, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Whitelist(){

    let whitelist = ["Wenwen23", "StellarFX", "TheNisse", "Slyz", "Wenwen23", "StellarFX", "TheNisse", "Slyz", "Wenwen23", "StellarFX", "TheNisse", "Slyz" ];
    let members = [];
    const [membersList, setMembersList] = useState(members);

    for(let i = 0; i < whitelist.length; i++){
        members.push(

            <div className='whitelist-members'>
                <div className='white-face'></div>
                <p id={whitelist[i]}>{whitelist[i]}</p>
            </div>

        );
    }

    return(

        <div className='whitelist-main-container'>
            <div className='whitelist-container'>
                {membersList}
            </div>
            <div className='whitelist-action-container'>
                <div className='action-title-container'>
                    <FontAwesomeIcon icon={faPlusCircle} className='icon'/>
                    <p>Actions</p>
                </div>
                <input id="whitelist-input" placeholder='Username...'></input>
                <div className='whitelist-buttons-container'>
                    <div className='whitelist-add' >
                        <FontAwesomeIcon icon={faPlus}/>
                        <p>Add</p>
                    </div>
                    <div className='whitelist-remove'>
                        <FontAwesomeIcon icon={faTimes}/>
                        <p>Remove</p>
                    </div>
                </div>
            </div>
        </div>

    );

}