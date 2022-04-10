import React, { useState , useEffect } from 'react';
import './PlayerCompo.scss';
import { faStar, faGavel } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const { ipcRenderer } = window.require('electron');

function PlayerCompo(props) {

    const opClass = ["op-player", "oped-player"];
    const banClass = ["ban-player", "baned-player"];
    const banIpClass = ["banip-player", "banedip-player"];

    const [op, setOp] = useState(props.op?1:0);
    const [ban, setBan] = useState(props.banned?1:0);
    const [banIp, setBanIp] = useState(props.bannedIp?1:0);

    useEffect(()=>{
        setOp(props.op?1:0);
        setBan(props.banned?1:0);
        setBanIp(props.bannedIp?1:0);
    },[props.op])

    function opSomeone(){
        ipcRenderer.send("change-status", {"user":props.user, "type":"ops", "path":props.path});
        setOp(Math.abs(op - 1));
    }
    function banSomeone(){
        ipcRenderer.send("change-status", {"user":props.user, "type":"banned-players", "path":props.path});
        setBan(Math.abs(ban - 1))
    }
    function banIpSomeone(){
        ipcRenderer.send("change-status", {"user":props.user, "type":"banned-ips", "path":props.path});
        setBanIp(Math.abs(banIp - 1))
    }

    return (

        <div className='player-container'>
            <div className="minecraft-face" style={{backgroundImage: 'url(https://mc-heads.net/avatar/'+props.user['uuid']+')'}}></div>
            <p className='player-name' title={props.user['name']}>{props.user['name']}</p>
            <div className='actions'>
                <div className={opClass[op]} onClick={opSomeone} >
                    <p><FontAwesomeIcon className='status-icon' icon={faStar} />{op === 1 ? "DeOP" : "OP"}</p>
                </div>
                <div className={banClass[ban]} onClick={banSomeone}>
                    <p><FontAwesomeIcon className='status-icon' icon={faGavel} />{ban === 1 ? "Unban" : "Ban"}</p>
                </div>
                <div className={banIpClass[banIp]} onClick={banIpSomeone}>
                    <p><FontAwesomeIcon className='status-icon' icon={faGavel} />{banIp === 1 ? `Unban\u00A0IP` : "Ban\u00A0IP"}</p>
                </div>
            </div>

        </div>

    );

}

export default PlayerCompo;