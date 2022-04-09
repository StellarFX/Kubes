import React, { useState } from 'react';
import './PlayerCompo.scss';
import { faStar, faGavel } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function PlayerCompo(props) {

    const opClass = ["op-player", "oped-player"];
    const banClass = ["ban-player", "baned-player"];
    const banIpClass = ["banip-player", "banedip-player"];

    const [op, setOp] = useState(props.op?1:0);
    const [ban, setBan] = useState(props.banned?1:0);
    const [banIp, setBanIp] = useState(props.bannedIp?1:0);

    return (

        <div className='player-container'>
            <div className="minecraft-face" style={{backgroundImage: 'url(https://mc-heads.net/avatar/'+props.uuid+')'}}></div>
            <p className='player-name' title={props.name}>{props.name}</p>
            <div className='actions'>
                <div className={opClass[op]} onClick={() => { setOp(Math.abs(op - 1)); }} >
                    <p><FontAwesomeIcon className='status-icon' icon={faStar} />{op === 1 ? "DeOP" : "OP"}</p>
                </div>
                <div className={banClass[ban]} onClick={() => { setBan(Math.abs(ban - 1))}}>
                    <p><FontAwesomeIcon className='status-icon' icon={faGavel} />{ban === 1 ? "Unban" : "Ban"}</p>
                </div>
                <div className={banIpClass[banIp]} onClick={() => { setBanIp(Math.abs(banIp - 1))}}>
                    <p><FontAwesomeIcon className='status-icon' icon={faGavel} />{banIp === 1 ? `Unban\u00A0IP` : "Ban\u00A0IP"}</p>
                </div>
            </div>

        </div>

    );

}

export default PlayerCompo;