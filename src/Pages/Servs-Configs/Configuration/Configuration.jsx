import React, { useState, useEffect } from 'react';
import './Configuration.scss';
import '../../../public/properties.txt';
import AceEditor from '../../../components/AceEditor/AceEditor';

const { ipcRenderer } = window.require('electron');

export default function Configuration(props){

    const [fileValue, setFileValue] = useState(props.properties);

    function changeValue(value){
        ipcRenderer.send("change-properties", value, props.path);
    }

    return(

        <div className='configurations-main-container'>
            
            {/* <Textarea spellCheck="false" variant="unstyled" placeholder="Your email" radius="xs" value={fileValue} onChange={(e) => setFile(e.currentTarget.value)}/> */}
            <AceEditor editedFile={{'Editedname': "server", 'Editedtype': "properties"}} change={changeValue} value={fileValue} setWidth="96%" setHeight="100%"/>
        </div>

    );

    
}

