import './Players.scss';
import React from 'react';
import PlayerCompo from '../PlayerCompo/PlayerCompo';


export default function Players(props){

    const playerList = props.userlist.map((user)=>{

        return(
            <PlayerCompo name={user['name']}/>
        )

    })

    return(

        <div className='players-main-container'>
            {playerList}
        </div>

    );

}