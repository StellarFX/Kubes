import React , {useState, useEffect, useRef, useCallback} from 'react';
import './FilePopUp.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { Input, Button } from '@mantine/core';

export default function FilePopUp(props){

    const [name, setName] = useState(props.name);
    const [extension, setExtension] = useState(props.type ?? "");
    const [placeHolder, setPlaceHolder] = useState('Name...');

    function isValidFileName(text) {
        const rg1 = /^[^\\\/\:\"\?\<\>\|]+$/i;
        return rg1.test(text);
    }

    function Execute(){
        if(props.action.substring(0,6) === "Rename" && isValidFileName(name)){
            props.rename(name, extension);
        }
        else if(props.action.substring(0,6) === "Create" && isValidFileName(name)){
            props.create(name, extension)
        }
        if(!isValidFileName(name)){
            setPlaceHolder("Enter valid name.");
        }
    }

    useEffect(()=>{
        console.log(props.resp, 'yo');
        if(props.resp === "exists"){
            setName('');
            setExtension('');
            setPlaceHolder('Already exists.');
        }
        else{
            setPlaceHolder('Name...');
        }
    },[props.resp]);

    return(
        <>
            <div className='darken-background' onClick={props.close}>
            </div>

            <div className='file-popup'>
                <p className='popup-title'><FontAwesomeIcon icon={faPen}/>{props.action}:</p>
                <div className='inputs'>
                    { props.type != "folder" ? 
                        <>
                            <Input className='file-name' value={name} onChange={(e) => setName(e.currentTarget.value)} placeholder={placeHolder}/>
                            <p>.</p>
                            <Input className='extension' value={extension} onChange={(e) => setExtension(e.currentTarget.value)} placeholder='...'/>
                        </>

                        :

                        <Input className='folder-name' value={name} onChange={(e) => setName(e.currentTarget.value)} placeholder={placeHolder}/>
                    }
                    
                </div>
                <div className='buttons'>
                    <Button className='ok' onClick={()=>Execute()}>Ok</Button>
                </div>
            </div>
        </>
    );
}