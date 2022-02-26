import React from 'react';
import { faFile, faFolder } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './File.scss';
import { Checkbox } from '@mantine/core';
import openFile from './FileManager';

function formattedDate(d = new Date) {
    return [d.getDate(), d.getMonth() + 1, d.getFullYear()]
        .map(n => n < 10 ? `0${n}` : `${n}`).join('/');
}

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}



export default function File(props) {

    const icon = <FontAwesomeIcon className="file-icon" icon={props.type == "folder" ? faFolder : faFile} />

    const created = formattedDate(props.created);

    return (
        <tr className="file" data-type={props.type}>

            <td>
                <Checkbox key={props.fileKey} checked={props.checked} onChange={props.onChange} color="violet" styles={{
                    "input": { backgroundColor: "#262333", border: "1px solid #262333" }
                }}/>
            </td>

            <td>
                {icon}
            </td>

            <td>
                <p className="file-name" onClick={() => { props.openFile(props.fileKey);}}>{props.name}</p>
            </td>

            <td>
                <p className="size">{formatBytes(props.size)}</p>
            </td>

            <td>
                <span className="created">{created}</span>
            </td>

        </tr>
    );

}