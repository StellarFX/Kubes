import React from 'react';
import ServCard from '../../components/ServCard/ServCard.jsx';
import './Servers.scss';
import { Button } from '@mantine/core';

function Servers(){

    const folderPath = "C:/Users/User/Documents/Servers_File";

    return(
        <div className='page-main-container'>
            <div className='page-title-container'>
                <p className='page-title'>Servers</p>
                <p className='text'>Folder path:</p>
                <p className='folder-path'>{folderPath}</p>
            </div>
            <div className='page-content' id="servers-content">
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