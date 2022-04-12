import './DeletePopup.scss';
import React , {useState, useEffect, useRef, useCallback} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { Input, Button } from '@mantine/core';

export default function DeletePopup(props){

    function confirm(){
        props.close();
        props.delete();
    }

    return(

        <>
            <div className='darken-background' onClick={props.close}>
            </div>

            <div className="delete-container">
                <p className="confirmation"><FontAwesomeIcon icon={faTrashCan}/>Are you sure you want to remove {props.name} ?</p>
                <div className='d-buttons'>
                    <Button className='ok' onClick={confirm}>Ok</Button>
                </div>
            </div>
        </>
      
    );
  
}