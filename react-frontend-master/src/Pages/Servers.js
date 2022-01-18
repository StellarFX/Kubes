import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import ServCard from '../components/ServCard/ServCard.jsx';
import './Servers.scss';

function Servers(){
    return(
        <div className='page-main-container'>
            <p className='page-title'>Servers</p>
            <div className='page-content' id="servers-content">
                <div className='add-server-container'>
                    
                </div>
                <div className='servers-grid'>
                    <ServCard status="0"/>
                    <ServCard status="1"/>
                    <ServCard status="2"/>
                    <ServCard status="4"/>
                    <ServCard status="3"/>
                    <ServCard status="0"/>
                    <ServCard status="1"/>
                    <ServCard status="1"/>
                </div>
            </div>
        </div>
    );
}

export default Servers;