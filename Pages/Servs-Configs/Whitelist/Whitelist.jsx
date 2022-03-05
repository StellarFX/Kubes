import './Whitelist.scss';
import React, { useState } from 'react';
import { faPlusCircle, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TextInput, Dialog } from '@mantine/core';

export default function Whitelist() {

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


  const [placeHolder, setPlaceHolder] = useState("Enter a name...")
  const [chosenMember, setChosenMember] = useState("");
  const [whitelistMembers, setWhitelistMembers] = useState(["Wenwen23", "StellarFX", "TheNisse", "Slyz"]);

  const [customDialogOpened, setCustomDialogOpened] = useState(false);
  const [customDialogStyle, setCustomDialogStyle] = useState({});
  const [customDialogContent, setCustomDialogContent] = useState("");

  const membersList = whitelistMembers.map((m) => {

    return (

      <div className='whitelist-members'>
        <div className='white-face'></div>
        <p id={m}>{m}</p>
      </div>

    );

  });

  function toggleDialog(content, style, toggle = !customDialogOpened) {
    setCustomDialogStyle(style);
    setCustomDialogContent(content);
    setCustomDialogOpened(toggle);
  }

  function whiteListAdd() {
    if (chosenMember.replaceAll(" ", "") != "" && whitelistMembers.indexOf(chosenMember) == -1) {
      setWhitelistMembers((whitelistMembers) => [...whitelistMembers, chosenMember]);
      setChosenMember("");
      toggleDialog("", false);
    }
    else {
      toggleDialog(<><FontAwesomeIcon style={{fontSize: "1.5rem"}}icon={faTimes} /><p>Please enter a valid name.</p></>, {root: {color: "white", backgroundColor: "var(--red)", borderColor: "#4a0a0a"}, closeButton: { color: "white", "&:hover": { backgroundColor: "#ff3636" }}}, true);
      // setChosenMember("Please enter a valid name.");
    }
  }

  function whiteListRemove() {
    if (chosenMember.replaceAll(" ", "") != "" && whitelistMembers.indexOf(chosenMember) != -1) {
      var array = [...whitelistMembers];
      array.splice(whitelistMembers.indexOf(chosenMember), 1);
      setWhitelistMembers(array);
      setChosenMember("");
      toggleDialog("", false);
    }
    else {
      toggleDialog(<><FontAwesomeIcon style={{fontSize: "1.5rem"}}icon={faTimes} /><p>Please enter a valid name.</p></>, {root: {color: "white", backgroundColor: "var(--red)", borderColor: "#4a0a0a"}, closeButton: { color: "white", "&:hover": { backgroundColor: "#ff3636" }}}, true);
      // setChosenMember("Please enter a valid name.");
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
        <TextInput className='whitelist-selector' placeholder={placeHolder} value={chosenMember} onChange={(e) => setChosenMember(e.currentTarget.value)} />
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