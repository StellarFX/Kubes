import React , {useState, useEffect} from 'react';
import { faFileMedical as faFilePlus, faPen, faFolderPlus, faArrowRotateRight, faTrashCan, faArrowLeft, faTimes } from '@fortawesome/free-solid-svg-icons';
import File from './File';
import FilePopUp from '../FilePopUp/FilePopUp';
import DeletePopup from '../DeletePopup/DeletePopup';
import './FileManager.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Checkbox , Dialog , Group } from '@mantine/core';
import { randomId, useListState } from '@mantine/hooks';
import { Dropzone, FullScreenDropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import AceEditor from '../AceEditor/AceEditor';

const { ipcRenderer } = window.require('electron');

export default function FileManager(props) {

    let checked = [];

    const [initialize, setInitialized] = useState(false);
    const [files, setFiles] = useState([]);
    const [checkboxes, checkboxesHandler] = useListState([]);

    useEffect(async()=>{
        let list = await ipcRenderer.invoke('file-manager', props.path);
        setFiles(list);  
    },[]);
    
    async function goInFolder(path, array){
        let list = await ipcRenderer.invoke('file-manager', path);
        setFiles(list);  
        changePath(array);      
    }

    useEffect(()=>{
        checked = files.map((val) => {
            return { "type": val.type, "name": val.name, "size": val.size, "created": val.created, "checked": false, key: val.key };
        });
        checked.sort((a, b) => {
            if(a['type'] === 'folder' && b['type'] !== 'folder'){
                return -1;
            }
            else if(a['type'] === 'folder' && b['type'] === 'folder'){
                return 0;
            }
            else if(a['type'] !== 'folder' && b['type'] === 'folder'){
                return 1;
            }
        });
        checkboxesHandler.setState(checked);
    },[files]);

    const [popUp, setPopUp] = useState(false);
    const [renamedFile, setRenamedFile] = useState();
    const [fileAction, setFileAction] = useState("");
    const [deleteW, setDeleteW] = useState(false);
    const [deleteA, setDeleteA] = useState("");
    const [editedFile, setEditedFile] = useState({});

    const [fileContent, setFileContent] = useState("");
    
    const allChecked = checkboxes.every((value) => value.checked);
    const everyChecked = checkboxes.filter((val) => { if(val.checked) { return val; } });
    const indeterminate = checkboxes.some((value) => value.checked) && !allChecked;

    const [managerPath, setManagerPath] = useState([props.server]);
    const [path, setPath] = useState("/"+props.server+"/");

    var items = checkboxes.map((val, index) => {
        return <File type={val.type} name={val.name} size={val.size} openFile={openFile} created={new Date(val.created)} key={val.key} fileKey={val.key} checked={val.checked} onChange={(e) => CheckFile(index, e)} />
    });

    function changePath(array){
        let p = "/";
        for(let i = 0; i < array.length; i++){
            p = p + array[i] + "/";
        }
        setPath(p);
    }

    async function openFile(key){
        const file = checkboxes.find(arrayFile => {
            return arrayFile.key === key;
        });

        if(file.type === "folder"){
            goInFolder(props.path + path.substring(1 + props.server.length, path.length) +file.name, [...managerPath, file.name]);
            setManagerPath((managerPath) => [...managerPath, file.name]);
        }
        else{
            let base = props.path.substring(0, props.path.length - (props.server.length + 1)) + path;
            let resp = await ipcRenderer.invoke("readFileContent", base + file.name + "." + file.type);
            setFileContent(resp);
            setEditedFile({'Editedname': file.name, 'Editedtype': file.type});
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

    const [customDialogOpened, setCustomDialogOpened] = useState(false);
    const [customDialogStyle, setCustomDialogStyle] = useState({});
    const [customDialogContent, setCustomDialogContent] = useState("");

    const [backResp, setBackResp] = useState("");

    function toggleDialog(content, style, toggle = !customDialogOpened) {
        setCustomDialogStyle(style);
        setCustomDialogContent(content);
        setCustomDialogOpened(toggle);
    }

    function CheckFile(index, e){
      checkboxesHandler.setItemProp(index, 'checked', e.currentTarget.checked);
    }
  
  
    function goBack(){
        goInFolder(props.path + path.substring(1 + props.server.length, path.length - managerPath[managerPath.length-1].length -2), managerPath.slice(0, managerPath.length-1));
        setManagerPath(managerPath.slice(0, managerPath.length-1));
    }
  

    function headChecker(){
      checkboxesHandler.setState((current) => current.map((value) => ({
        ...value, checked: !allChecked
      })))
    }
  
    const [contentValue, setContentValue] = useState(0);
  

    async function deleteFile(){
        let resp = "";
        for(let i = 0; i < everyChecked.length; i++){
            checkboxesHandler.setItemProp(checkboxes.indexOf(everyChecked[i]), 'checked', false);
            checkboxes.splice(checkboxes.indexOf(everyChecked[i]), 1);
            let base = props.path.substring(0, props.path.length - (props.server.length + 1)) + path;

            if(everyChecked[i]['type'] === 'folder' || everyChecked[i]['type'] === ''){
                resp = await ipcRenderer.invoke('remove', base + everyChecked[i]['name']);
            }
            else{
                resp = await ipcRenderer.invoke('remove', base + everyChecked[i]['name'] + "." + everyChecked[i]['type']);
            }
            
        }
        if(resp === "success"){
            reloadFiles();
        }
    }

    function openDeleteW(){
        if(everyChecked.length > 1){
            setDeleteA("these files");
        }
        if(everyChecked.length === 1){
            if(everyChecked[0].type === "folder"){
                setDeleteA(everyChecked[0].name);  
            }
            else{
                setDeleteA(everyChecked[0].name + "." + everyChecked[0].type);  
            }
        }
        setDeleteW(true);
    }

    function OpenRename(){
        setRenamedFile(everyChecked[0]);
        if(everyChecked[0].type === "folder"){
            setFileAction("Rename folder");
        }
        else{
            setFileAction("Rename file");
        }
        setPopUp(true);
    }

    async function RenameFile(name, extension){
        setBackResp('');
        let base = props.path.substring(0, props.path.length - (props.server.length + 1)) + path;
        let resp;
        if(extension != "folder"){
            checkboxesHandler.setItemProp(checkboxes.indexOf(renamedFile), 'type', extension);            
            resp = await ipcRenderer.invoke("rename-file", {'oldPath': base + renamedFile['name'] + "." + renamedFile['type'], 'newPath': base + name + "." + extension});
        }
        else{
            resp = await ipcRenderer.invoke("rename-file", {'oldPath': base + renamedFile['name'], 'newPath': base + name});
        }

        console.log(resp);
        if(resp === "success"){
            setPopUp(false);
            checkboxesHandler.setItemProp(checkboxes.indexOf(renamedFile), 'checked', false);
            checkboxesHandler.setItemProp(checkboxes.indexOf(renamedFile), 'name', name);
            reloadFiles();
            setBackResp('');
        }
        else if(resp === "exists"){
            setBackResp('exists');
        }
        
    }
  
    function OpenCreate(type){
        for(let i = 0; i < everyChecked.length; i++){

            checkboxesHandler.setItemProp(checkboxes.indexOf(everyChecked[i]), 'checked', false);
          
        }
        if(type === "folder"){
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

    async function CreateFile(name, type){
        setBackResp("");
        let base = props.path.substring(0, props.path.length - (props.server.length + 1)) + path;

        let resp = "";

        if(type === 'folder'){
            resp = await ipcRenderer.invoke('create', {'path': base + name, 'type': 'folder'});
        }
        else{
            resp = await ipcRenderer.invoke('create', {'path': base + name + "." + type, 'type': 'file'});
        }
        checkboxes.push(

            { "type": type.replaceAll(".", ""), "name": name.replaceAll(".", ""), "size": 0, "created": new Date().getTime(), "checked": false, key: randomId() }

        );

        if(resp === "success"){
            reloadFiles();
            setPopUp(false);
            setBackResp("");
        }
        else if(resp === "exists"){
            setBackResp("exists");
        }
        
    }

    function reloadFiles(){

        goInFolder(props.path + path.substring(1 + props.server.length, path.length), managerPath);
    }

    function changeFileValue(value){
        let base = props.path.substring(0, props.path.length - (props.server.length + 1)) + path;
        ipcRenderer.send("changeFileContent", value, base + editedFile['Editedname'] + "." + editedFile['Editedtype']);
    }
  

  useEffect(()=>{
    if(everyChecked.length === 0){
        setOptionsStyle(uncheckedStyle);
        setPenOptionsStyle(uncheckedStyle);
        setFolderStyle(borderStyle);
    }
    if(everyChecked.length === 1){
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

        contentValue === 0 ? 

        <div className="file-manager">
            {
                popUp === true ?

                <FilePopUp resp={backResp} action={fileAction} type={renamedFile.type} name={renamedFile.name} rename={RenameFile} create={CreateFile} close={()=>{setPopUp(false); setBackResp('')}}/>
                : <></>
            }
            {

                deleteW === true ?

                <DeletePopup name={deleteA} close={()=>setDeleteW(false)} delete={deleteFile}/>

                :

                <></>
              
            }
            
            <div className="top-bar">
                <div className="title">
                    <h3>File&nbsp;Manager
                        <FontAwesomeIcon icon={faArrowRotateRight} className="f-reload" onClick={()=>reloadFiles()}/>
                        <FontAwesomeIcon icon={faFilePlus} className="f-addfile" onClick={()=>OpenCreate("file")}/>
                        <FontAwesomeIcon icon={faFolderPlus} className="f-addfolder" style={folderStyle} onClick={()=>OpenCreate("folder")}/>
                        <FontAwesomeIcon icon={faPen} className="f-rename" style={penOptionsStyle} onClick={()=>OpenRename()}/>
                        <FontAwesomeIcon icon={faTrashCan} className="f-delete" style={optionsStyle} onClick={()=>openDeleteW()}/>
                    </h3>
                    <span id="path">{path}</span>
                </div>
            </div>
            <div className="file-list-container">

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
                            <th width="0.5%">Name</th>
                            <th width="5%">Size</th>
                            <th width="10%">Created&nbsp;at</th>
                        </tr>
                    </thead>
                    <tbody>
                        {path === "/" + props.server + "/" ?
                        
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

                        {items}
                    </tbody>

                </table>
                <FullScreenDropzone styles={{
                    root: {
                        backgroundColor: "#16142075",
                        borderRadius: "30px"
                    },
                    dropzone: {
                        position: 'absolute',
                        marginTop: '2rem',
                        height: 'calc(100% - 5rem)',
                        width: 'calc(100% - 3rem)',
                        backgroundColor: "#16142075"
                    },
                    reject: {
                        backgroundColor: "#c52b1726"
                    },
                    active: {
                        backgroundColor: "#3a94df47"
                    }
            
                }} onDrop={async (files) => {
                    for(let i = 0; i < files.length; i++){
                        let base = props.path.substring(0, props.path.length - (props.server.length + 1)) + path;

                        let data = {'destinationPath': base + files[i]['name'], 'pathOrigin': files[i]['path'].replaceAll('\\', '/')};
                        
                        let resp = await ipcRenderer.invoke('import', data);

                        if(resp === 'success'){
                            reloadFiles();
                        }
                        else if (resp === 'exists'){
                            toggleDialog(<><FontAwesomeIcon style={{fontSize: "1.5rem"}}icon={faTimes} /><p>{files[i]['name']} already exists</p></>, {root: {color: "white", backgroundColor: "var(--red)", borderColor: "#4a0a0a"}, closeButton: { color: "white", "&:hover": { backgroundColor: "#ff3636" }}}, true);
                        }
                    }

                }}> 
                {()=>null}
                </FullScreenDropzone>
                
                <Dropzone onDrop={async (files)=>{

                for(let i = 0; i < files.length; i++){
                    let base = props.path.substring(0, props.path.length - (props.server.length + 1)) + path;

                    let data = {'destinationPath': base + files[i]['name'], 'pathOrigin': files[i]['path'].replaceAll('\\', '/')};

                    let resp = await ipcRenderer.invoke('import', data);

                    if(resp === 'success'){
                        reloadFiles();
                    }
                }


                }

                }>
                    {()=>{
                        return (
                        <div className='dropzone-content'>
                            <svg className="svg-inline--fa dropzone-icon" id="Layer_1" height="512" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1"><path fill="currentColor" d="m19 0h-6a5.006 5.006 0 0 0 -5 5v.1a5.009 5.009 0 0 0 -4 4.9v.1a5.009 5.009 0 0 0 -4 4.9v4a5.006 5.006 0 0 0 5 5h6a5.006 5.006 0 0 0 5-5v-.1a5.009 5.009 0 0 0 4-4.9v-.1a5.009 5.009 0 0 0 4-4.9v-4a5.006 5.006 0 0 0 -5-5zm-17 15a3 3 0 0 1 3-3h6a2.988 2.988 0 0 1 2.638 1.6l-3.455 3.463-.475-.479a1.992 1.992 0 0 0 -2.708-.111l-4.621 3.96a2.96 2.96 0 0 1 -.379-1.433zm12 4a3 3 0 0 1 -3 3h-6a2.971 2.971 0 0 1 -1.118-.221l4.406-3.779.476.481a2 2 0 0 0 2.828 0l2.408-2.413zm4-5a3 3 0 0 1 -2 2.816v-1.816a5.006 5.006 0 0 0 -5-5h-5a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3zm4-5a3 3 0 0 1 -2 2.816v-1.816a5.006 5.006 0 0 0 -5-5h-5a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3zm-18 6a1 1 0 1 1 1 1 1 1 0 0 1 -1-1z"/></svg>
                            <p>Click here to add files!</p>    
                            <p className='precision'>(Folders are only accepted by drag & drop)</p>
                        </div>
                        )
                    }}
                </Dropzone>

            </div>

            <Dialog className="customDialog" styles={customDialogStyle} opened={customDialogOpened} onClose={() => setCustomDialogOpened(false)} withCloseButton size="lg" radius="md">
                <div className="customDialog-content">
                    {customDialogContent}
                </div>
            </Dialog>
            
        </div>

        :
            
        <div className='editor-container'>
            <div className='editor-header'>
                <FontAwesomeIcon icon={faArrowLeft} onClick={() => {setContentValue(0); reloadFiles()}}/>
                <div className='edited-div'>
                    <p className='edited-file-name'>{editedFile['Editedname']}</p>
                    <p>.</p>
                    <p>{editedFile['Editedtype']}</p>
                </div>
            </div>
            <AceEditor editedFile={editedFile} value={fileContent} change={changeFileValue} setWidth="100%" setHeight='110%'/>
        </div>
        
        
    );

}

/*export { files };*/