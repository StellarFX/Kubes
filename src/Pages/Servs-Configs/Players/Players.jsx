import './Players.scss';
import React from 'react';
import PlayerCompo from '../PlayerCompo/PlayerCompo';


export default function Players(props){

    const playerList = props.userlist.map((user)=>{

        let banned = false;
        let bannedIp = false;
        let oped = false;
        
        oped = props.ops.some((users)=>{
            if(users["uuid"]== user['uuid']){
                return true;
            }
        });
        banned = props.banned.some((users)=>{
            if(users["uuid"]== user['uuid']){
                return true;
            }
        });
        bannedIp = props.bannedip.some((users)=>{
            if(users["uuid"]== user['uuid']){
                return true;
            }
        });

        return(
            <PlayerCompo user={user} op={oped} banned={banned} bannedIp={bannedIp} path={props.path}/>
        )

    })

    return(

        <div className='players-main-container'>
            {playerList}
        </div>

    );

}