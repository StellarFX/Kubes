import React, { useState, useEffect } from 'react';
import './Create.scss';
import { faPlus , faPen , faServer , faCodeBranch , faMicrochip , faCloud, faFile } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TextInput, Select, Button } from '@mantine/core';

const inputStyle = {

  dropdown: {

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
    backgroundColor: "#7447ff",
    color: "white"
  }

}

export default function Create({ open, setOpen }) {

  // <------------------------------ VALUES ------------------------------>

  const [opacity, setOpacity] = useState(0);
  const [serverNameValue, setServerName] = useState("");
  const [apiValue, setApiValue] = useState("bukkit");
  const [versionValue, setVersionValue] = useState("1.18.1");
  const [ramValue, setRamValue] = useState("1024");
  const [portValue, setPortValue] = useState("25565");
  const [eulaValue, setEulaValue] = useState("true");

  // <------------------------------ VALUES ------------------------------>

  function setOpenWithTransition(val) {

    setOpacity(0);

    setTimeout(() => {
      setOpen(val);
    }, 200);

  }

  useEffect(() => {
    setTimeout(() => {
      setOpacity(1);
    }, 200);
  }, []);

  if(open) {
    return (
      <div className="create-server" style={{transition: ".2s", opacity: opacity}} onClick={() => setOpenWithTransition(false)}>
        <div className='create-server-container' onClick={(e) => e.stopPropagation()}>
            <p className='create-title'><FontAwesomeIcon icon={faPlus}/>Create a new server</p>
            <div className='create-properties'>
              <div className='create-input-names'>
                <div className='c-servername'>
                  <p><FontAwesomeIcon icon={faPen}/>Server name:</p>
                  <TextInput className="input i-servername" placeholder="Type here to write..." value={serverNameValue} onChange={(e) => setServerName(e.currentTarget.value)} required/>
                </div>
                <div>
                  <p><FontAwesomeIcon icon={faServer}/>API:</p>
                  <Select zIndex={20000} className="input" styles={inputStyle} placeholder="Bukkit" value={apiValue} onChange={setApiValue} required data={[
                  { value: "bukkit", label: "Bukkit"},
                  { value: "spigot", label: "Spigot"},
                  { value: "paper", label: "Paper"},
                  { value: "forge", label: "Forge"}
                  ]}/>
                </div>
                <div className='c-version'>
                  <p><FontAwesomeIcon icon={faCodeBranch}/>Version:</p>
                  <Select zIndex={20000} className="input" styles={inputStyle} placeholder="1.12.2" value={versionValue} onChange={setVersionValue} required data={[
                  { value: "1.18.1", label: "1.18.1"},
                  { value: "1.12.2", label: "1.12.2"},
                  { value: "paper", label: "Paper"},
                  { value: "forge", label: "Forge"}
                  ]}/>
                </div>
                <div>
                  <p><FontAwesomeIcon icon={faMicrochip}/>RAM:</p>
                  <TextInput className="input i-small" placeholder="Type here to write..." value={ramValue} onChange={setRamValue} required/>
                  <p className='c-precision'>(in MB)</p>
                </div>
                <div>
                  <p><FontAwesomeIcon icon={faCloud}/>Port:</p>
                  <TextInput className="input i-small" placeholder="Type here to write..." value={portValue} onChange={setPortValue} required/>
                </div>
                <div>
                  <p><FontAwesomeIcon icon={faFile}/>Eula:</p>
                  <Select zIndex={20000} className="input" styles={inputStyle} placeholder="True" value={eulaValue} onChange={setEulaValue} required data={[
                  { value: "true", label: "True"},
                  { value: "false", label: "False"},
                  ]}/>
                  </div>
              </div>
              <div className='more-params'>
                
                <Button>Pute</Button>
                
              </div>
            </div>
            
        </div>
      </div>

      );
  } else {
    return (
      <div></div>
    )
  }

    

}