import React , {useState, useEffect, useRef, useCallback} from 'react';
import './FilePopUp.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { Input, Button } from '@mantine/core';
import { hasUncaughtExceptionCaptureCallback } from 'process';

export default function FilePopUp(props){

    const [name, setName] = useState(props.name);
    const [extension, setExtension] = useState(props.type ?? "");

    function Execute(){
        if(props.action.substring(0,6) == "Rename" && name.replaceAll(" ", "").replaceAll(".", "") != "" && extension.replaceAll(" ", "").replaceAll(".", "") != ""){
            props.rename(name, extension);
        }
        else if(props.action.substring(0,6) == "Create" && name.replaceAll(" ", "").replaceAll(".", "") != "" && extension.replaceAll(" ", "").replaceAll(".", "") != ""){
            props.create(name, extension)
        }
    }

    return(
        <>
            <div className='darken-background' onClick={props.close}>
            </div>

            <div className='file-popup'>
                <p className='popup-title'><FontAwesomeIcon icon={faPen}/>{props.action}:</p>
                <div className='inputs'>
                    { props.type != "folder" ? 
                        <>
                            <Input className='file-name' value={name} onChange={(e) => setName(e.currentTarget.value)} placeholder='Name...'/>
                            <p>.</p>
                            <Input className='extension' value={extension} onChange={(e) => setExtension(e.currentTarget.value)} placeholder='...'/>
                        </>

                        :

                        <Input className='folder-name' value={name} onChange={(e) => setName(e.currentTarget.value)} placeholder='Name...'/>
                    }
                    
                </div>
                <div className='buttons'>
                    <Button className='ok' onClick={()=>Execute()}>Ok</Button>
                </div>
            </div>
        </>
    );
}