import { useParams } from "react-router-dom";
import React from 'react';
import './ServerManage.scss';

function ServerManage(){

    const {id} = useParams();
    const { config } = useParams();

    return(
        <div className='page-main-container'>
            <div className='page-title-container'>
                <p className='page-title'>{id}</p>
            </div>
            <div className='page-content'>
                
            </div>
        </div>
    )

}

export default ServerManage;