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

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + '\u00A0' + sizes[i];
}



export default function File(props) {

    const icon = <FontAwesomeIcon className={props.type == "folder" ? "folder-icon" : "file-icon"} icon={props.type == "folder" ? faFolder : faFile} />

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

            <td className='td-name'>
                <div onClick={() => { props.openFile(props.fileKey);}} title={props.name + (props.type === "folder" ? "" : "." + props.type)}>
                    <p className="file-name">{props.name}</p>
                    { props.type == "folder" ? <></> :
                    <>
                        <p>.</p>
                        <p className="file-ext">{props.type}</p>
                    </>
                    }
                </div>
            </td>

            <td className='td-size'>
                <p className="size">{formatBytes(props.size)}</p>
            </td>

            <td>
                <span className="created">{created}</span>
            </td>

        </tr>
    );

}