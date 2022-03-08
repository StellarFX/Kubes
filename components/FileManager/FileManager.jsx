import React , {useState, useEffect, useRef, useCallback} from 'react';
import { faFileMedical as faFilePlus, faPen, faFolderPlus, faArrowRotateRight, faTrashCan, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import File from './File';
import FilePopUp from '../FilePopUp/FilePopUp';
import './FileManager.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Checkbox , Text , Group } from '@mantine/core';
import { randomId, useListState } from '@mantine/hooks';
import { Dropzone, FullScreenDropzone } from '@mantine/dropzone';
import AceEditor from '../AceEditor/AceEditor';

let files = [{
    key: randomId(),
    type: "html",
    name: "index",
    size: 6541,
    created: new Date().getTime()
},{
    key: randomId(),
    type: "folder",
    name: "assets",
    size: 10841,
    created: new Date().getTime()
},{
    key: randomId(),
    type: "js",
    name: "index",
    size: 3541,
    created: new Date().getTime()
},{
    key: randomId(),
    type: "js",
    name: "navbar",
    size: 8641,
    created: new Date().getTime()
},{
    key: randomId(),
    type: "folder",
    name: "components",
    size: 3741,
    created: new Date().getTime()
},{
    key: randomId(),
    type: "java",
    name: "whitelist",
    size: 2141,
    created: new Date().getTime()
},{
    key: randomId(),
    type: "folder",
    name: "pages",
    size: 9241,
    created: new Date().getTime()
},{
    key: randomId(),
    type: "js",
    name: "whitelist",
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
},{
    key: randomId(),
    type: "html",
    name: "Joe Mama",
    size: 4655614546541,
    created: new Date().getTime()
},{
    key: randomId(),
    type: "py",
    name: "Joe Papa",
    size: 4655614546541,
    created: new Date().getTime()
},{
    key: randomId(),
    type: "folder",
    name: "Joe Katze",
    size: 4655614546541,
    created: new Date().getTime()
},{
    key: randomId(),
    type: "folder",
    name: "Joe Doggo",
    size: 4655614546541,
    created: new Date().getTime()
},{
    key: randomId(),
    type: "properties",
    name: "Joe Papi",
    size: 4655614546541,
    created: new Date().getTime()
},]

let checked = files.map((val) => {
    return { "type": val.type, "name": val.name, "size": val.size, "created": val.created, "checked": false, key: val.key };
});

export default function FileManager(props) {

    const [popUp, setPopUp] = useState(false);
    const [renamedFile, setRenamedFile] = useState();
    const [fileAction, setFileAction] = useState("");

    const [currentFileList, setCurrentFileList] = useState(files);
    const [editedFile, setEditedFile] = useState("");
    const [checkboxes, checkboxesHandler] = useListState(checked);
    const allChecked = checkboxes.every((value) => value.checked);
    const everyChecked = checkboxes.filter((val) => { if(val.checked) { return val; } });
    const indeterminate = checkboxes.some((value) => value.checked) && !allChecked;

    let managerPath = [props.server];
    const [stringedPath, setPath] = useState("/"+props.server+"/");

    function changePath(){
        let path ="/";
        for(let i = 0; i < managerPath.length; i++){
            path=path+managerPath[i]+"/";
        }
        setPath(path);
    }

    const items = checkboxes.map((val, index) => {
        return <File type={val.type} name={val.name} size={val.size} openFile={openFile} created={new Date(val.created)} key={val.key} fileKey={val.key} checked={val.checked} onChange={(e) => CheckFile(val, index, e, val.checked)} />
    });

    function openFile(key){
        const file = checkboxes.find(arrayFile => {
            return arrayFile.key == key;
        });

        if(file.type == "folder"){

            let files2 = [{
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

            checked = files2.map((val) => {
                return { "type": val.type, "name": val.name, "size": val.size, "created": val.created, "checked": false, key: val.key };
            });

            setCurrentFileList(files2);
            checkboxesHandler.setState(checked);
            managerPath.push(file.name);
            changePath();
        }
        else{
            setEditedFile(file.name + "." + file.type);
            setContentValue(1);
        }
    }

  

    const borderStyle = {
        borderTopRightRadius : "10px",
        borderBottomRightRadius: "10px"
    }
    const checkedStyle = {
      display: "flex",
      transform: "translateX(0%)",
      transformOrigin: "center",
      opacity: 1
    };
    const checkedStyle2 = {
        display: "flex",
        transform: "translateX(-104%)",
        transformOrigin: "center",
        opacity: 1
      };
    const uncheckedStyle = {
      transform: "translateX(110%)",
      transformOrigin: "center",
      opacity: 0
    }
    const [optionsStyle, setOptionsStyle] = useState(uncheckedStyle);
    const [penOptionsStyle, setPenOptionsStyle] = useState(uncheckedStyle);
    const [folderStyle, setFolderStyle] = useState(borderStyle);

  

    function CheckFile(val, index, e, value){
      console.log(checkboxes[index].key);
      checkboxesHandler.setItemProp(index, 'checked', e.currentTarget.checked);
    }
  
  
    function goBack(){
        checked = files.map((val) => {
            return { "type": val.type, "name": val.name, "size": val.size, "created": val.created, "checked": false, key: val.key };
        });
        setCurrentFileList(files);
        checkboxesHandler.setState(checked);
        managerPath.splice(managerPath.length, 1);
        changePath();
    }
  

    function headChecker(){
      checkboxesHandler.setState((current) => current.map((value) => ({
        ...value, checked: !allChecked
      })))
    }
  

    const [editorMode, setEditorMode] = useState("text");
    const editor = useCallback((node) => {
        if(node) {
            setEditorMode(getModeForPath(editedFile)["name"]);
        }
    }, [editedFile]);
    const [contentValue, setContentValue] = useState(0);
  

    function deleteFile(){
        for(let i = 0; i < everyChecked.length; i++){
            checkboxesHandler.setItemProp(checkboxes.indexOf(everyChecked[i]), 'checked', false);
            checkboxes.splice(checkboxes.indexOf(everyChecked[i]), 1);
        }
    }

    function OpenRename(){
        setRenamedFile(everyChecked[0]);
        if(everyChecked[0].type == "folder"){
            setFileAction("Rename folder");
        }
        else{
            setFileAction("Rename file");
        }
        setPopUp(true);
    }
  

    function RenameFile(name, extension){
        checkboxesHandler.setItemProp(checkboxes.indexOf(renamedFile), 'name', name);
        if(extension != "folder"){
            checkboxesHandler.setItemProp(checkboxes.indexOf(renamedFile), 'type', extension);
        }
        setPopUp(false);
        checkboxesHandler.setItemProp(checkboxes.indexOf(renamedFile), 'checked', false);
    }

  
    function OpenCreate(type){
        for(let i = 0; i < everyChecked.length; i++){

            checkboxesHandler.setItemProp(checkboxes.indexOf(everyChecked[i]), 'checked', false);
          
        }
        if(type == "folder"){
            setFileAction("Create folder");
            setRenamedFile(
                {type: "folder", name: ""}
            );
        }
        else{
            setFileAction("Create file");
            setRenamedFile(
                {type: "", name: ""}
            );
        }

        setPopUp(true);
    }

    function CreateFile(name, type){
        checkboxes.push(

            { "type": type.replaceAll(".", ""), "name": name.replaceAll(".", ""), "size": 0, "created": new Date().getTime(), "checked": false, key: randomId() }

        )

        currentFileList.push(

            { "type": type.replaceAll(".", ""), "name": name.replaceAll(".", ""), "size": 0, "created": new Date().getTime(), "checked": false, key: randomId() }

        );

        console.log({ "type": type, "name": name, "size": 0, "created": new Date().getTime(), "checked": false, key: randomId() });
        console.log(checkboxes);
        setPopUp(false);
    }


    function reloadFiles(){

        checked = currentFileList.map((val) => {
                return { "type": val.type, "name": val.name, "size": val.size, "created": val.created, "checked": false, key: val.key };
            });

        checkboxesHandler.setState(checked);
    }
  

  useEffect(()=>{
    if(everyChecked.length == 0){
        setOptionsStyle(uncheckedStyle);
        setPenOptionsStyle(uncheckedStyle);
        setFolderStyle(borderStyle);
    }
    if(everyChecked.length == 1){
        setOptionsStyle(checkedStyle);
        setPenOptionsStyle(checkedStyle);
        setFolderStyle(null);
    }
    if(everyChecked.length >= 2){
        setOptionsStyle(checkedStyle2);
        setPenOptionsStyle(uncheckedStyle);
        setFolderStyle(null);
    }
    
  }, [everyChecked.length]);

    return (

        contentValue == 0 ? 

        <div className="file-manager">
            {
                popUp == true ?

                <FilePopUp action={fileAction} type={renamedFile.type} name={renamedFile.name} rename={RenameFile} create={CreateFile} close={()=>setPopUp(false)}/>
                : <></>
            }
            
            <div className="top-bar">
                <div className="title">
                    <h3>File&nbsp;Manager
                        <FontAwesomeIcon icon={faArrowRotateRight} className="f-reload" onClick={()=>reloadFiles()}/>
                        <FontAwesomeIcon icon={faFilePlus} className="f-addfile" onClick={()=>OpenCreate("file")}/>
                        <FontAwesomeIcon icon={faFolderPlus} className="f-addfolder" style={folderStyle} onClick={()=>OpenCreate("folder")}/>
                        <FontAwesomeIcon icon={faPen} className="f-rename" style={penOptionsStyle} onClick={()=>OpenRename()}/>
                        <FontAwesomeIcon icon={faTrashCan} className="f-delete" style={optionsStyle} onClick={()=>deleteFile()}/>
                    </h3>
                    <span id="path">{stringedPath}</span>
                </div>
            </div>

            <table className="folders-container">
                <thead>
                    <tr>
                        <th width="2%">
                            <Checkbox 
                            styles={{"input": { backgroundColor: "#262333", border: "1px solid #262333" }}} 
                            color="violet" 
                            indeterminate={indeterminate} 
                            checked={allChecked}
                            onChange={() => headChecker()}/>
                        </th>
                        <th width="5%">Type</th>
                        <th width="10%">Name</th>
                        <th width="5%">Size</th>
                        <th width="10%">Created at</th>
                    </tr>
                </thead>
                <tbody>
                    {stringedPath == "/" + props.server + "/" ?
                    
                    <></>

                    :

                    <tr className='go-back'>
                        <th><p onClick={()=> goBack()}>..</p></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                    </tr>

                    }

                    {items[0].key == null ? <></> : items}
                </tbody>

            </table>
            <Dropzone>
                {()=>{
                    <Group position="center" spacing="xl" style={{pointerEvents: 'none' }}>
                        <Text size="xl" inline>Drop files here</Text>
                    </Group>
                }}
            </Dropzone>
        </div>

        :
            
        <div className='editor-container'>
            <div className='editor-header'>
                <FontAwesomeIcon icon={faArrowLeft} onClick={() => setContentValue(0)}/>
                <p className='edited-file-name'>{editedFile}</p>
            </div>
            <AceEditor editedFile={editedFile} value="Pute"/>
        </div>
        
        
    );

}

export { files };