import React from 'react';
import { faFileMedical as faFilePlus, faDownload, faFolderPlus, faArrowRotateRight } from '@fortawesome/free-solid-svg-icons';
import File from './File';
import './FileManager.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function FileManager() {

    return (
        <div className="file-manager">
            <div className="top-bar">
                <div className="title">
                    <h3>File Manager</h3>
                    <span id="path">/</span>
                </div>

                <div className="actions">
                    <FontAwesomeIcon icon={faDownload}/>
                    <FontAwesomeIcon icon={faFilePlus}/>
                    <FontAwesomeIcon icon={faFolderPlus}/>
                    <FontAwesomeIcon icon={faArrowRotateRight}/>
                </div>
            </div>

            <table className="folders-container">
                <thead>
                    <tr>
                        <th>File type</th>
                        <th>Name</th>
                        <th>Created at</th>
                    </tr>
                </thead>
                <tbody>
                    <File type="file" name="Joe Mama" created={new Date()}/>
                </tbody>
                
            </table>
        </div>
    );

}