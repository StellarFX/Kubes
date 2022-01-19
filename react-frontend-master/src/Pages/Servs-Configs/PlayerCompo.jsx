import React, { useState } from 'react';
import './PlayerCompo.scss';
import { faStar, faGavel } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function PlayerCompo(props){

    const opClass = ["op-player", "oped-player"];
    const banClass = ["ban-player", "baned-player"];
    const banIpClass = ["banip-player", "banedip-player"];

    const [op, setOp] = useState(0);
    const [ban, setBan] = useState(0);
    const [banIp, setBanIp] = useState(0);

    return(

        <div className='player-container'>
            <div class="minecraft-face"></div>
            <p className='player-name'>{props.name}</p>
            <div className={opClass[op]} onClick={()=>{if(op==0){setOp(1)}else{setOp(0)}}}>
                <p><FontAwesomeIcon className='status-icon' icon={faStar}/>OP</p>
            </div>
            <div className={banClass[ban]} onClick={()=>{if(ban==0){setBan(1)}else{setBan(0)}}}>
                <p><FontAwesomeIcon className='status-icon' icon={faGavel}/>Ban</p>
            </div>
            <div className={banIpClass[banIp]} onClick={()=>{if(banIp==0){setBanIp(1)}else{setBanIp(0)}}}>
                <p><FontAwesomeIcon className='status-icon' icon={faGavel}/>Ban IP</p>
            </div>
        </div>

    );

}

export default PlayerCompo;