import './Whitelist.scss';
import React, { useState } from 'react';
import { faPlusCircle, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TextInput, Dialog, Select } from '@mantine/core';

const { ipcRenderer } = window.require('electron');

var userDict = {};

export default function Whitelist(props) {

  const inputStyle = {

    dropdown: {
      zIndex: "50000",
      backgroundColor: "#13121f",
      border: "none",
      borderRadius: "0",
      padding: "0"
    },

    item: {
      color: "#585279",
      borderRadius: "0"
    },

    hovered: {
      backgroundColor: "#7447ff",
      color: "white"
    },

    selected: {
      backgroundColor: "#0e0d16",
      color: "white"
    }

  }

  const [initialized, setInitialized] = useState(false);

  const [whitelistMembers, setWhitelistMembers] = useState([]);
  const [userlist, setUserlist] = useState([]);
  

  async function scanWhitelist() {
    let data = await ipcRenderer.invoke("scan-whitelist", props.path);
    setWhitelistMembers(data['whitelist']);
    setUserlist(data['userlist']);

    for(let i = 0; i < data['userlist'].length; i++){
      userDict[data['userlist'][i]['uuid']] = data['userlist'][i]['name'];
    }
  };
  
  if(initialized == false){
    setInitialized(true);
    scanWhitelist();
  }

  const [chosenMember, setChosenMember] = useState([]);

  const [customDialogOpened, setCustomDialogOpened] = useState(false);
  const [customDialogStyle, setCustomDialogStyle] = useState({});
  const [customDialogContent, setCustomDialogContent] = useState("");

  const membersList = whitelistMembers.map((m) => {

    return (

      <div className='whitelist-members'>
        <div className='white-face' style={{backgroundImage:'url(https://mc-heads.net/avatar/'+m['uuid']+')'}}></div>
        <p id={m['uuid']}>{m['name']}</p>
      </div>

    );

  });

  const selectItems = userlist.map((m) => {

    return (

      { value: m['uuid'], label: m['name']}

    );

  });

  function toggleDialog(content, style, toggle = !customDialogOpened) {
    setCustomDialogStyle(style);
    setCustomDialogContent(content);
    setCustomDialogOpened(toggle);
  }

  function whiteListAdd() {
    let check = whitelistMembers.some((users)=>{
      if(users['uuid'] === chosenMember){
        return true;
      }
    });

    if (check !== true) {
      setWhitelistMembers((whitelistMembers) => [...whitelistMembers, {'uuid': chosenMember, 'name': userDict[chosenMember], 'level': 4, "bypassesPlayerLimit":false}]);
      toggleDialog("", {}, false);

      ipcRenderer.send("change-status", {"user": {'uuid': chosenMember, 'name': userDict[chosenMember]}, "type":"whitelist", "path":props.path});
    }

    else {
      toggleDialog(<><FontAwesomeIcon style={{fontSize: "1.5rem"}}icon={faTimes} /><p>{userDict[chosenMember]} is already in the whitelist.</p></>, {root: {color: "white", backgroundColor: "var(--red)", borderColor: "#4a0a0a"}, closeButton: { color: "white", "&:hover": { backgroundColor: "#ff3636" }}}, true);
    }
  }

  function whiteListRemove() {
    let check = whitelistMembers.some((users)=>{
      if(users['uuid'] === chosenMember){
        return true;
      }
    });

    if (check) {
      var array = [...whitelistMembers];
      array.splice(whitelistMembers.indexOf({'uuid': chosenMember, 'name': userDict[chosenMember], 'level': 4, "bypassesPlayerLimit":false}), 1);
      setWhitelistMembers(array);
      toggleDialog("", {}, false);

      ipcRenderer.send("change-status", {"user": {'uuid': chosenMember, 'name': userDict[chosenMember]}, "type":"whitelist", "path":props.path});
    }
    else {
      toggleDialog(<><FontAwesomeIcon style={{fontSize: "1.5rem"}}icon={faTimes} /><p>{userDict[chosenMember]} is not in the whitelist.</p></>, {root: {color: "white", backgroundColor: "var(--red)", borderColor: "#4a0a0a"}, closeButton: { color: "white", "&:hover": { backgroundColor: "#ff3636" }}}, true);
    }
  }

  return (

    <div className='whitelist-main-container'>
      <div className='whitelist-container'>
        {membersList}
      </div>
      <div className='whitelist-action-container'>
        <div className='action-title-container'>
          <FontAwesomeIcon icon={faPlusCircle} className='icon' />
          <p>Actions</p>
        </div>
        {/*<TextInput className='whitelist-selector' placeholder={placeHolder} value={chosenMember} onChange={(e) => setChosenMember(e.currentTarget.value)} />*/}
        <Select zIndex={20000} className="input whitelist-selector" styles={inputStyle} placeholder="Select a player" value={chosenMember} onChange={setChosenMember} required data={selectItems}/>
        <div className='whitelist-buttons-container'>
          <div className='whitelist-add' onClick={whiteListAdd}>
            <FontAwesomeIcon icon={faPlus} />
            <p>Add</p>
          </div>
          <div className='whitelist-remove' onClick={whiteListRemove}>
            <FontAwesomeIcon icon={faTimes} />
            <p>Remove</p>
          </div>
        </div>
      </div>
      <Dialog className="customDialog" styles={customDialogStyle} opened={customDialogOpened} onClose={() => setCustomDialogOpened(false)} withCloseButton size="lg" radius="md">
        <div className="customDialog-content">
          {customDialogContent}
        </div>
      </Dialog>
    </div>

  );

}