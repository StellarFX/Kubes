import { useParams } from "react-router-dom";
import React from 'react';
import './ServerManage.scss';
import ServNavbar from '../components/ServNavbar/ServNavbar.jsx';

function ServerManage(){

    const {id} = useParams();
    const { config } = useParams();

    return(
        <div className='page-main-container'>
            <div className='page-title-container'>
                <p className='page-title'>{id}</p>
            </div>
            <div className='page-content' id="servmanage-content">
                <ServNavbar/>
                <div className="config-container">
                    <p className="config-name">{config.charAt(0).toUpperCase() + config.slice(1)}</p>
                </div>
            </div>
        </div>
    )

}

export default ServerManage;