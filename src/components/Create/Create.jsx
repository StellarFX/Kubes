import React, { useState, useEffect, useRef } from 'react';
import './Create.scss';
import { faPlus , faPen , faServer , faCodeBranch , faMicrochip , faCloud, faFile, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TextInput, Select, Button, Accordion } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate } from "react-router-dom";

const { ipcRenderer } = window.require('electron');

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

  const navigate = useNavigate();
  const [opacity, setOpacity] = useState(0);
  const [placeHolder, setPlaceHolder] = useState("Type here to write...");
  const [creating, setCreating] = useState(false);

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

  ipcRenderer.on('created-server', ()=>{
    setCreating(false);
    navigate('/servers');
    setOpenWithTransition(false);
  });

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
      ram_value: (val) => val !== "" && parseInt(val) % 1024 === 0 ? null : ' ',
      port_value: (val) => val !== "" && /^((6553[0-5])|(655[0-2][0-9])|(65[0-4][0-9]{2})|(6[0-4][0-9]{3})|([1-5][0-9]{4})|([0-5]{0,5})|([0-9]{1,4}))$/.test(val) ? null : ' ',
      ip_value: (val) => val !== "" && /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)(.(?!$)|$)){4}$/.test(val) ? null : ' ',
      motd_value: (val) => val !== "" && val ? null : ' ',
      eula_value: (val)=> val === "true" ? null : ' '
    }

  });

  const createForm = useRef(null);

  async function createServer(values){
    setCreating(true);
    let resp = await ipcRenderer.invoke("create-server", {
      'name': values['server_name'],
      'ram': values['ram_value'],
      'port': values['port_value'],
      'motd': values['motd_value'],
      'ip': values['ip_value']==='127.0.0.1'?"":values['ip_value']
    });

    if(resp){
      setCreating(false);
      setPlaceHolder("Name already used.");
      form.setFieldValue('server_name', "");
      form.setFieldError('server_name', " ");
    }
    else{
      setPlaceHolder("Type here to write...");
    }
  }

  if(open) {
    return (
      <div className="create-server" style={{transition: ".2s", opacity: opacity}} onClick={() => !creating?setOpenWithTransition(false):console.log("Can't close while creating a server.")}>
        <div className='create-server-container' onClick={(e) => e.stopPropagation()}>
            <p className='create-title'>
              <FontAwesomeIcon icon={faPlus}/>
              Create a new server
              <FontAwesomeIcon className="close" onClick={() => !creating?setOpenWithTransition(false):console.log("Can't close while creating a server.")} icon={faTimes}/>
            </p>
            <div className='create-properties'>
              <form ref={createForm} onSubmit={form.onSubmit((values) => !creating?createServer(values):console.log('You are already creating a server.'))}>
                <div className='create-input-names'>
                  <div className='c-servername'>
                    <p><FontAwesomeIcon icon={faPen}/>Server name:</p>
                    <TextInput className="input i-servername" placeholder={placeHolder} {...form.getInputProps('server_name')} disabled={creating}/>
                  </div>
                  <div>
                    <p><FontAwesomeIcon icon={faServer}/>API:</p>
                    <Select zIndex={20000} className="input" styles={inputStyle} placeholder="Spigot" {...form.getInputProps('api_value')} data={[
                    { value: "spigot", label: "Spigot"},
                    { value: "bukkit", label: "Bukkit"},
                    { value: "paper", label: "Paper"},
                    { value: "forge", label: "Forge"}
                    ]} disabled/>
                  </div>
                  <div className='c-version'>
                    <p><FontAwesomeIcon icon={faCodeBranch}/>Version:</p>
                    <Select zIndex={20000} className="input" styles={inputStyle} placeholder="1.16.4" {...form.getInputProps('version_value')} data={[
                    { value: "1.16.4", label: "1.16.4"},
                    { value: "1.12.2", label: "1.12.2"},
                    { value: "1.9.3", label: "1.9.3"},
                    { value: "1.8.5", label: "1.8.5"}
                    ]} disabled/>
                  </div>
                  <div>
                    <p><FontAwesomeIcon icon={faMicrochip}/>RAM:</p>
                    <TextInput className="input i-small" placeholder="..." {...form.getInputProps('ram_value')} disabled={creating}/>
                    <p className='c-precision'>(in MB)</p>
                  </div>
                  <div>
                    <p><FontAwesomeIcon icon={faCloud}/>Port:</p>
                    <TextInput className="input i-small" placeholder="..." {...form.getInputProps('port_value')} disabled={creating}/>
                  </div>
                  <div>
                    <p><FontAwesomeIcon icon={faFile}/>Eula:</p>
                    <Select zIndex={20000} className="input" styles={inputStyle} placeholder="True" {...form.getInputProps('eula_value')} data={[
                    { value: "true", label: "True"},
                    { value: "false", label: "False"},
                    ]} disabled={creating}/>
                    </div>
                </div>
                <div className='more-params'>
                  
                  <Accordion>
                    <Accordion.Item label="More parameters...">
                      <div className='accordion-container'>
                        <div>
                          <p>IP</p>
                          <TextInput className="input i-small" placeholder="Enter IP..." {...form.getInputProps('ip_value')} disabled={creating}/>
                        </div>
                        <div>
                          <p>Motd</p>
                          <TextInput className="input" placeholder="Type here to write..." {...form.getInputProps('motd_value')} disabled={creating}/>
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