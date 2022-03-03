import './Whitelist.scss';
import React, { useState } from 'react';
import { faPlusCircle, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Select } from '@mantine/core';

export default function Whitelist(){
  
  const inputStyle = {

    dropdown: {
  
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

  let whitelistMembers = ["Wenwen23", "StellarFX", "TheNisse", "Slyz", "Wenwen23", "StellarFX", "TheNisse", "Slyz", "Wenwen23", "StellarFX", "TheNisse", "Slyz" ];
  
  const [whiteList, setWhiteList] = useState([]);
  let membersComponents = [];
    

  for(let i = 0; i < whitelistMembers.length; i++){
    membersComponents.push(
      <div className='whitelist-members'>
        <div className='white-face'></div>
        <p id={whitelistMembers[i]}>{whitelistMembers[i]}</p>
      </div>
    );
    setWhiteList(whiteList.push(  //en développement c'est normal que ça marche pas
      {value : whitelistMembers[i], label : whitelistMembers[i]}
    ));
    
  }

  const [membersList, setMembersList] = useState(membersComponents);

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
                <Select zIndex={20000} className="select-whitelist" styles={inputStyle} placeholder="Select a member" required data={whiteList}/>
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