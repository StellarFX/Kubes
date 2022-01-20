import './Whitelist.scss';
import React from 'react';

export default function Whitelist(){

    let whitelist = ["Wenwen23", "StellarFX", "TheNisse", "Slyz", "Wenwen23", "StellarFX", "TheNisse", "Slyz", "Wenwen23", "StellarFX", "TheNisse", "Slyz"];
    let members = [];

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
                {members}
            </div>
            <div className='whitelist-action-container'>
                <div className='action-title-container'>

                </div>
                <input></input>
                <div className='whitelist-buttons-container'>
                    
                </div>
            </div>
        </div>

    );

}