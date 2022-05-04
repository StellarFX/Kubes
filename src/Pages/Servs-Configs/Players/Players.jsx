import './Players.scss';
import React, { useState , useEffect } from 'react';
import PlayerCompo from '../PlayerCompo/PlayerCompo';

const { ipcRenderer } = window.require('electron');

export default function Players(props){

    const [userlist, setUserlist] = useState([]);
    const [oplist, setOplist] = useState([]);
    const [bannedlist, setBannedlist] = useState([]);
    const [bannedIplist, setBannedIplist] = useState([]);

    useEffect(async()=>{
        let data = await ipcRenderer.invoke("scan-players", props.path);
        setUserlist(data['usercache']);
        setBannedIplist(data['banned-ips']);
        setBannedlist(data['banned-players']);
        setOplist(data['ops']);
    },[]);

    let playerList = userlist.map((user)=>{

        let banned = false;
        let bannedIp = false;
        let oped = false;
        
        oped = oplist.some((users)=>{
            if(users["uuid"]=== user['uuid']){
                return true;
            }
        });
        banned = bannedlist.some((users)=>{
            if(users["uuid"]=== user['uuid']){
                return true;
            }
        });
        bannedIp = bannedIplist.some((users)=>{
            if(users["uuid"]=== user['uuid']){
                return true;
            }
        });

        return(
            <PlayerCompo user={user} op={oped} banned={banned} bannedIp={bannedIp} path={props.path}/>
        )

    });

    return(

        <div className='players-main-container'>
            {playerList}
        </div>

    );

}