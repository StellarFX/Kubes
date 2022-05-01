import React, { useState, useEffect, useRef, forwardRef } from 'react';
import './Create.scss';
import { faPlus , faPen , faServer , faCodeBranch , faMicrochip , faCloud, faFile, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dialog, TextInput, Select, Button, Accordion } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const { ipcRenderer } = window.require('electron');

const inputStyle = {

  dropdown: {

    backgroundColor: "#13121f",
    border: "none",
    borderRadius: "0",
    padding: "0",
    scrollBar: {
      backgroundColor: "#ff0000"
    }
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

let apiList = [{}];
let versionList = [{}];

export default function Create({ open, setOpen }) {
  
  // <------------------------------ VALUES ------------------------------>

  const navigate = useNavigate();
  const [opacity, setOpacity] = useState(0);
  const [placeHolder, setPlaceHolder] = useState("Type here to write...");
  const [creating, setCreating] = useState(false);
  const [buttonName, setButtonName] = useState('Create');
  const [buildingInfo, setBuildingInfo] = useState("");

  const [customDialogOpened, setCustomDialogOpened] = useState(false);
  const [customDialogStyle, setCustomDialogStyle] = useState({});
  const [customDialogContent, setCustomDialogContent] = useState("");

  // <------------------------------ VALUES ------------------------------>

  function setOpenWithTransition(val) {
    setOpacity(0);

    setTimeout(() => {
      setOpen(val);
    }, 200);
  }

  function toggleDialog(content, style, toggle = !customDialogOpened) {
    setCustomDialogStyle(style);
    setCustomDialogContent(content);
    setCustomDialogOpened(toggle);
  }

  useEffect(() => {
    setTimeout(() => {
      setOpacity(1);
    }, 200);
  }, []);

  ipcRenderer.on('created-server', ()=>{
    setCreating(false);
    setButtonName('Create');
    navigate('/servers');
    setOpenWithTransition(false);
    setBuildingInfo('');
  });

  ipcRenderer.on('building-jar', ()=>{
    setBuildingInfo('getting the jar file...');
  });

  ipcRenderer.on('creating-server', ()=>{
    setBuildingInfo('creating the server...');
  });

  ipcRenderer.on('launching-server', ()=>{
    setBuildingInfo('launching the server...');
  });

  ipcRenderer.on('preparing-spawn', ()=>{
    setBuildingInfo('preparing spawn area...');
  });

  ipcRenderer.on('err-creating-server', (e, err)=>{
    setBuildingInfo('');
    setCreating(false);
    setButtonName('Create');
    if(err && err !== ""){
      toggleDialog(<><FontAwesomeIcon style={{fontSize: "1.5rem"}}icon={faTimes} /><p>{err}</p></>, {root: {color: "white", zIndex: "9999",backgroundColor: "var(--red)", borderColor: "#4a0a0a"}, closeButton: { color: "white", "&:hover": { backgroundColor: "#ff3636" }}}, true);
    }
  });

  const form = useForm({

    initialValues: {
      server_name: '',
      api_value: "bukkit",
      version_value: "1.8.8",
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


  useEffect(()=>{
    axios.get("https://api.kubesmc.ml/apis").then((resp) => {
      apiList = resp.data['available'].map((e)=>{
        return(
          {value: e, label: e.charAt(0).toUpperCase() + e.slice(1)}
        );
      });
      form.setFieldValue('api_value', apiList[0]['value']);

    }).catch(err=>console.log(err));
  },[]);


  useEffect(()=>{
    if(form.getInputProps('api_value')['value']){
      
      axios.get("https://api.kubesmc.ml/apis/"+form.getInputProps('api_value')['value']).then((resp)=>{
        versionList = resp.data['versions'].reverse().map((e)=>{
          return(
            {value: e, label: e}
          );
        });
        form.setFieldValue('version_value', versionList[0]['value']);
      });
    }
  },[form.getInputProps('api_value')['value']]);

  const createForm = useRef(null);

  async function createServer(values){
    setCreating(true);
    setButtonName('Creating...');
    let resp = await ipcRenderer.invoke("create-server", {
      'name': values['server_name'],
      'ram': values['ram_value'],
      'port': values['port_value'],
      'motd': values['motd_value'],
      'ip': values['ip_value']==='127.0.0.1'?"":values['ip_value'],
      'api': values['api_value'],
      'version': values['version_value']
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
                    <Select zIndex={20000} nothingFound="Nobody here" className="input" styles={inputStyle} placeholder="Spigot" {...form.getInputProps('api_value')} data={apiList} disabled={creating}/>
                  </div>
                  <div className='c-version'>
                    <p><FontAwesomeIcon icon={faCodeBranch}/>Version:</p>
                    <Select zIndex={20000} nothingFound="Nobody here" className="input" styles={inputStyle} placeholder="1.16.4" {...form.getInputProps('version_value')} data={versionList} disabled={creating}/>
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
                    <Select zIndex={20000} className="input" nothingFound="Nobody here" styles={inputStyle} placeholder="True" {...form.getInputProps('eula_value')} data={[
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
                    <p className='build-info'>{buildingInfo}</p>
                    <button type="submit"><FontAwesomeIcon icon={faPlus}/>{buttonName}</button>
                  </div>
                  
                </div>
              </form>
            </div>
            <Dialog className="customDialog" styles={customDialogStyle} opened={customDialogOpened} onClose={() => setCustomDialogOpened(false)} withCloseButton size="lg" radius="md">
              <div className="customDialog-content">
                {customDialogContent}
              </div>
            </Dialog>
        </div>
        
      </div>

      );
  } else {
    return (
      <div></div>
    )
  }

    

}