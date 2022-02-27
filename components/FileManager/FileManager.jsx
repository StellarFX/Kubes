import React , {useState} from 'react';
import { faFileMedical as faFilePlus, faDownload, faFolderPlus, faArrowRotateRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import File from './File';
import './FileManager.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Checkbox } from '@mantine/core';
import { randomId, useListState } from '@mantine/hooks';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";

let files = [{
    key: randomId(),
    type: "html",
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
    type: "js",
    name: "Joe Katze",
    size: 4655614546541,
    created: new Date().getTime()
},{
    key: randomId(),
    type: "js",
    name: "Joe Doggo",
    size: 4655614546541,
    created: new Date().getTime()
},{
    key: randomId(),
    type: "css",
    name: "Joe Papi",
    size: 4655614546541,
    created: new Date().getTime()
},]

let checked = files.map((val) => {
    return { "type": val.type, "name": val.name, "size": val.size, "created": val.created, "checked": false, key: val.key };
});

export default function FileManager(props) {

    const [editedFile, setEditedFile] = useState("");
    const [pathFile, setPathFile] = useState("/"+props.server+"/");
    const [checkboxes, checkboxesHandler] = useListState(checked);
    const allChecked = checkboxes.every((value) => value.checked);
    const indeterminate = checkboxes.some((value) => value.checked) && !allChecked;

    const items = checkboxes.map((val, index) => {
        return <File type={val.type} name={val.name} size={val.size} openFile={openFile} created={new Date(val.created)} fileKey={val.key} checked={val.checked} onChange={(e) => checkboxesHandler.setItemProp(index, 'checked', e.currentTarget.checked)} />
    });

    function openFile(key){
        const file = checkboxes.find(arrayFile => {
            return arrayFile.key == key;
        });

        console.log("You opened : " + file.name + " " + file.type);
        if(file.type == "folder"){

            setPathFile(pathFile + file.name + "/");

            files = [{
                key: randomId(),
                type: "properties",
                name: "server",
                size: 4655614546541,
                created: new Date().getTime()
            },{
                key: randomId(),
                type: "bat",
                name: "start",
                size: 4655614546541,
                created: new Date().getTime()
            },{
                key: randomId(),
                type: "css",
                name: "oyé",
                size: 4655614546541,
                created: new Date().getTime()
            }];

            checked = files.map((val) => {
                return { "type": val.type, "name": val.name, "size": val.size, "created": val.created, "checked": false, key: val.key };
            });

            checkboxesHandler.setState(checked);

            console.log(files, checked, items);
        }
        else{
            setEditedFile(file.name + "." + file.type);
            setContentValue(1);
        }
    }

    

    const [contentValue, setContentValue] = useState(0);

    return (

        contentValue == 0 ? 

        <div className="file-manager">
            <div className="top-bar">
                <div className="title">
                    <h3>File Manager</h3>
                    <span id="path">{pathFile}</span>
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
                    <tr className='go-back'>
                        <p>..</p>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                    </tr>
                    {items}
                    {items}
                    {items}
                </tbody>

            </table>
        </div>

        :

        <div className='editor-container'>
            <div className='editor-header'>
                <FontAwesomeIcon icon={faArrowLeft} onClick={()=>setContentValue(0)}/>
                <p className='edited-file-name'>{editedFile}</p>
            </div>
            <AceEditor
            mode="javascript"
            theme="github"
            name="file-editor"
            width='100%'
            height='100%'
            editorProps={{ $blockScrolling: false }}
            />
        </div>
        
    );

}

export { files };