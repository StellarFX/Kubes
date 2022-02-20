import React, { useState } from 'react';
import './PlayerCompo.scss';
import { faStar, faGavel } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function PlayerCompo(props) {

    const opClass = ["op-player", "oped-player"];
    const banClass = ["ban-player", "baned-player"];
    const banIpClass = ["banip-player", "banedip-player"];

    const [op, setOp] = useState(0);
    const [ban, setBan] = useState(0);
    const [banIp, setBanIp] = useState(0);

    return (

        <div className='player-container'>
            <div className="minecraft-face"></div>
            <p className='player-name'>{props.name}</p>
            <div className='actions'>
                <div className={opClass[op]} onClick={() => { setOp(Math.abs(op - 1)); }} >
                    <p><FontAwesomeIcon className='status-icon' icon={faStar} />OP</p>
                </div>
                <div className={banClass[ban]} onClick={() => { setBan(Math.abs(ban - 1))}}>
                    <p><FontAwesomeIcon className='status-icon' icon={faGavel} />Ban</p>
                </div>
                <div className={banIpClass[banIp]} onClick={() => { setBanIp(Math.abs(banIp - 1))}}>
                    <p><FontAwesomeIcon className='status-icon' icon={faGavel} />Ban IP</p>
                </div>
            </div>

        </div>

    );

}

export default PlayerCompo;