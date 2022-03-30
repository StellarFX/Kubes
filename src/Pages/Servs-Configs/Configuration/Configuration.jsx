import { render } from '@testing-library/react';
import React, { useState, useEffect } from 'react';
import './Configuration.scss';
import { Textarea } from '@mantine/core';
import '../../../public/properties.txt';
import AceEditor from '../../../components/AceEditor/AceEditor';

export default function Configuration(props){

    const [fileValue, setFileValue] = useState(props.properties);

    return(

        <div className='configurations-main-container'>
            
            {/* <Textarea spellCheck="false" variant="unstyled" placeholder="Your email" radius="xs" value={fileValue} onChange={(e) => setFile(e.currentTarget.value)}/> */}
            <AceEditor editedFile={{'Editedname': "server", 'Editedtype': "properties"}} value={fileValue} onChange={(val) => setFileValue(val)} setWidth="96%" setHeight="100%"/>
        </div>

    );

    
}

