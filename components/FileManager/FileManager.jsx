import React from 'react';
import { faFileMedical as faFilePlus, faDownload, faFolderPlus, faArrowRotateRight } from '@fortawesome/free-solid-svg-icons';
import File from './File';
import './FileManager.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Checkbox } from '@mantine/core';
import { randomId, useListState } from '@mantine/hooks';

let files = [{
    key: randomId(),
    type: "file",
    name: "Joe Mama",
    size: 4655614546541,
    created: new Date().getTime()
},{
    key: randomId(),
    type: "folder",
    name: "Joe Papa",
    size: 4655614546541,
    created: new Date().getTime()
},{
    key: randomId(),
    type: "file",
    name: "Joe Katze",
    size: 4655614546541,
    created: new Date().getTime()
},{
    key: randomId(),
    type: "file",
    name: "Joe Doggo",
    size: 4655614546541,
    created: new Date().getTime()
},{
    key: randomId(),
    type: "file",
    name: "Joe Papi",
    size: 4655614546541,
    created: new Date().getTime()
},]

export default function FileManager() {

    const checked = files.map((val) => {
        return { "type": val.type, "name": val.name, "size": val.size, "created": val.created, "checked": false, key: val.key };
    });

    const [checkboxes, checkboxesHandler] = useListState(checked);
    const allChecked = checkboxes.every((value) => value.checked);
    const indeterminate = checkboxes.some((value) => value.checked) && !allChecked;

    function openFile(key){
        const file = checkboxes.find(arrayFile => {
            return arrayFile.key == key;
        });

        console.log("You opened : " + file.name);
    }

    const items = checkboxes.map((val, index) => {
        return <File type={val.type} name={val.name} size={val.size} openFile={openFile} created={new Date(val.created)} fileKey={val.key} checked={val.checked} onChange={(e) => checkboxesHandler.setItemProp(index, 'checked', e.currentTarget.checked)} />
    });

    return (
        <div className="file-manager">
            <div className="top-bar">
                <div className="title">
                    <h3>File Manager</h3>
                    <span id="path">/</span>
                </div>

                <div className="actions">
                    <FontAwesomeIcon icon={faDownload} />
                    <FontAwesomeIcon icon={faFilePlus} />
                    <FontAwesomeIcon icon={faFolderPlus} />
                    <FontAwesomeIcon icon={faArrowRotateRight} />
                </div>
            </div>

            <table className="folders-container">
                <thead>
                    <tr>
                        <th width="5%">
                            <Checkbox 
                            styles={{"input": { backgroundColor: "#262333", border: "1px solid #262333" }}} 
                            color="violet" 
                            indeterminate={indeterminate} 
                            checked={allChecked}
                            onChange={() => checkboxesHandler.setState((current) => current.map((value) => ({ ...value, checked: !allChecked})))}/>
                        </th>
                        <th width="10%">File type</th>
                        <th width="20%">Name</th>
                        <th width="10%">Size</th>
                        <th width="20%">Created at</th>
                    </tr>
                </thead>
                <tbody>
                    {items}
                    {items}
                    {items}
                </tbody>

            </table>
        </div>
    );

}

export { files };