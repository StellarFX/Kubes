import React, { useState, useEffect, useRef } from 'react';
import './Create.scss';
import { faPlus , faPen , faServer , faCodeBranch , faMicrochip , faCloud, faFile, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TextInput, Select, Button, Accordion } from '@mantine/core';
import { useForm } from '@mantine/form';

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
    backgroundColor: "#0e0d16",
    color: "white"
  }

}

export default function Create({ open, setOpen }) {

  // <------------------------------ VALUES ------------------------------>

  const [opacity, setOpacity] = useState(0);
  /*const [serverNameValue, setServerName] = useState("");
  const [apiValue, setApiValue] = useState("bukkit");
  const [versionValue, setVersionValue] = useState("1.18.1");
  const [ramValue, setRamValue] = useState("1024");
  const [portValue, setPortValue] = useState("25565");
  const [IPValue, setIPValue] = useState("127.0.0.1");
  const [MotdValue, setMotdValue] = useState("Server built with Kubes!");
  const [eulaValue, setEulaValue] = useState("true");

  const formArray = [serverNameValue, apiValue, versionValue, ramValue, portValue, IPValue, MotdValue, eulaValue];*/

  const varToString = varObj => Object.keys(varObj)[0];

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

  /*function serverCreate(){
    console.log(varToString({ serverNameValue }));
    let allFilled = formArray.every((value)=> value !== "" && value !== undefined);
    if(allFilled){

      const rg1 = /^[^\\\/\:\"\?\<\>\|]+$/i;
      if(rg1.test(serverNameValue)){

      }
      else{

      }
    }
    else{
      for(let i = 0; i < formArray.length; i++){
        if(formArray[i] === "" || formArray[i] === undefined){
        }
      }
    }
    setOpenWithTransition(false);

  }*/

  const form = useForm({

    initialValues: {
      server_name: '',
      api_value: "bukkit",
      version_value: "1.18.1",
      ram_value: "1024",
      port_value: "25565",
      ip_value: "127.0.0.1",
      motd_value: "Server built with Kubes!",
      eula_value: "false"
    },

    validate: {
      server_name: (val) => val !== "" && /^[^\\/:"?<>|]+$/i.test(val) ? null : ' ',
      ram_value: (val) => val !== "" && /^\d+$/.test(val) && parseInt(val) >= 1024 ? null : ' ',
      port_value: (val) => val !== "" && /^((6553[0-5])|(655[0-2][0-9])|(65[0-4][0-9]{2})|(6[0-4][0-9]{3})|([1-5][0-9]{4})|([0-5]{0,5})|([0-9]{1,4}))$/.test(val) ? null : ' ',
      ip_value: (val) => val !== "" && /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)(.(?!$)|$)){4}$/.test(val) ? null : ' ',
      motd_value: (val) => val !== "" && val ? null : ' ',
      eula_value: (val)=> val === "true" ? null : ' '
    }

  });

  const createForm = useRef(null);

  if(open) {
    return (
      <div className="create-server" style={{transition: ".2s", opacity: opacity}} onClick={() => setOpenWithTransition(false)}>
        <div className='create-server-container' onClick={(e) => e.stopPropagation()}>
            <p className='create-title'><FontAwesomeIcon icon={faPlus}/>Create a new server<FontAwesomeIcon className="close" onClick={() => setOpenWithTransition(false)} icon={faTimes}/></p>
            <div className='create-properties'>
              <form ref={createForm} onSubmit={form.onSubmit((values) => console.log(values))}>
                <div className='create-input-names'>
                  <div className='c-servername'>
                    <p><FontAwesomeIcon icon={faPen}/>Server name:</p>
                    <TextInput className="input i-servername" placeholder="Type here to write..." {...form.getInputProps('server_name')}/>
                  </div>
                  <div>
                    <p><FontAwesomeIcon icon={faServer}/>API:</p>
                    <Select zIndex={20000} className="input" styles={inputStyle} placeholder="Bukkit" {...form.getInputProps('api_value')} data={[
                    { value: "bukkit", label: "Bukkit"},
                    { value: "spigot", label: "Spigot"},
                    { value: "paper", label: "Paper"},
                    { value: "forge", label: "Forge"}
                    ]}/>
                  </div>
                  <div className='c-version'>
                    <p><FontAwesomeIcon icon={faCodeBranch}/>Version:</p>
                    <Select zIndex={20000} className="input" styles={inputStyle} placeholder="1.12.2" {...form.getInputProps('version_value')} data={[
                    { value: "1.18.1", label: "1.18.1"},
                    { value: "1.12.2", label: "1.12.2"},
                    { value: "1.9.3", label: "1.9.3"},
                    { value: "1.8.5", label: "1.8.5"}
                    ]}/>
                  </div>
                  <div>
                    <p><FontAwesomeIcon icon={faMicrochip}/>RAM:</p>
                    <TextInput className="input i-small" placeholder="..." {...form.getInputProps('ram_value')}/>
                    <p className='c-precision'>(in MB)</p>
                  </div>
                  <div>
                    <p><FontAwesomeIcon icon={faCloud}/>Port:</p>
                    <TextInput className="input i-small" placeholder="..." {...form.getInputProps('port_value')}/>
                  </div>
                  <div>
                    <p><FontAwesomeIcon icon={faFile}/>Eula:</p>
                    <Select zIndex={20000} className="input" styles={inputStyle} placeholder="True" {...form.getInputProps('eula_value')} data={[
                    { value: "true", label: "True"},
                    { value: "false", label: "False"},
                    ]}/>
                    </div>
                </div>
                <div className='more-params'>
                  
                  <Accordion>
                    <Accordion.Item label="More parameters...">
                      <div className='accordion-container'>
                        <div>
                          <p>IP</p>
                          <TextInput className="input i-small" placeholder="Enter IP..." {...form.getInputProps('ip_value')}/>
                        </div>
                        <div>
                          <p>Motd</p>
                          <TextInput className="input" placeholder="Type here to write..." {...form.getInputProps('motd_value')}/>
                        </div>
                      </div>
                    </Accordion.Item>
                  </Accordion>
                  <div className='create-button'>
                    <button type="submit"><FontAwesomeIcon icon={faPlus}/>Create</button>
                  </div>
                  
                </div>
              </form>
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