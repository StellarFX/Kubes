import './Whitelist.scss';
import React, { useState } from 'react';
import { faPlusCircle, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TextInput } from '@mantine/core';

export default function Whitelist(){
  
  const inputStyle = {

    dropdown: {
      zIndex: "50000",
      backgroundColor: "#13121f",
      border: "none",
      borderRadius: "0",
      padding: "0"
    },
  
    item: {
      color: "#585279",
      borderRadius: "0"
    },
  
    hovered: {
      backgroundColor: "#7447ff",
      color: "white"
    },
  
    selected: {
      backgroundColor: "#0e0d16",
      color: "white"
    }
  
  }

  
  const [placeHolder, setPlaceHolder] = useState("Enter a name...")
  const [chosenMember, setChosenMember] = useState("");
  const [whitelistMembers, setWhitelistMembers] = useState(["Wenwen23", "StellarFX", "TheNisse", "Slyz"]);
  const [membersComponents, setMembersComponents] = useState(whitelistMembers.map((m) => {
  
    return {value: m, label: m}
  
  }));
  const [membersList, setMembersList] = useState(membersComponents);



  

  

  /*for(let i = 0; i < whitelistMembers.length; i++){
    cool => [...cool,
      <div className='whitelist-members'>
        <div className='white-face'></div>
        <p id={whitelistMembers[i]}>{whitelistMembers[i]}</p>
      </div>
    ];
  }*/

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
                <TextInput className='whitelist-selector' placeholder={placeHolder} value={chosenMember} onChange={(e) => setChosenMember(e.currentTarget.value)}/>
                <div className='whitelist-buttons-container'>
                    <div className='whitelist-add' onClick={whiteListAdd}>
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