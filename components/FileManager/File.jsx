import React from 'react';
import { faFile, faFolder } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './File.scss';

function formattedDate(d = new Date) {
    return [d.getDate(), d.getMonth()+1, d.getFullYear()]
        .map(n => n < 10 ? `0${n}` : `${n}`).join('/');
  }

export default function File(props) {

    const icon = <FontAwesomeIcon className="file-icon" icon={props.type == "folder" ? faFolder : faFile}/>

    const created = formattedDate(props.created);

    return (
        <tr className="file" data-type={props.type}>
            <td>
                {icon}
            </td>
            <td>
                <p className="file-name">{props.name}</p>
            </td>

            <td>
                <span className="created">{created}</span>
            </td>
            
        </tr>
    );

}