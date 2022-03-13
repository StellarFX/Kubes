import './DeletePopup.scss';
import React , {useState, useEffect, useRef, useCallback} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { Input, Button } from '@mantine/core';

export default function DeletePopup(props){


    return(

        <>
            <div className='darken-background' onClick={props.close}>
            </div>

            <div className="delete-container">
                <p className="confirmation"><FontAwesomeIcon icon={faTrashCan}/>Are you sure you want to remove {props.name} ?</p>
            </div>
        </>
      
    );
  
}