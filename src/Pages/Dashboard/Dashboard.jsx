import ServCard from '../../components/ServCard/ServCard.jsx';
import Whadis from '../../components/Whadis/Whadis.jsx';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState , useEffect } from 'react';
import { randomId, useListState } from '@mantine/hooks';
import { Link } from 'react-router-dom';
import './Dashboard.scss';

const {ipcRenderer} = window.require('electron');

function Dashboard() {

  const IP = '90.35.227.53';

  const [opacityy, setOpacity] = useState('0');
  const [transitionn, setTransition] = useState('0.2s');
  const [lastServ, lastServHandler] = useState({});
  const [scanned, setScanned] = useState(false);

  useEffect(async()=>{
    let resp = await ipcRenderer.invoke('last-server-launched');
    setScanned(true);
    if(resp === undefined){
      return;
    }
    else{
      let stat = await ipcRenderer.invoke('get-activity', resp['path']);
      resp['status'] = stat;
      lastServHandler(resp);
    }
  },[]);

  useEffect(()=>{
    ipcRenderer.removeAllListeners();
  },[]);

  ipcRenderer.on('closed-server', (e, path)=>{
    if(lastServ !== undefined){
      if(path === lastServ['path']){
        lastServHandler({name: lastServ['name'], path: lastServ['path'], api: lastServ['api'], version: lastServ['version'], port: lastServ['port'], status: 0, key: randomId()});
      }
    }
  });

  ipcRenderer.on('started-server', (e, path)=>{
    if(lastServ !== undefined){
      if(path === lastServ['path']){
        lastServHandler({name: lastServ['name'], path: lastServ['path'], api: lastServ['api'], version: lastServ['version'], port: lastServ['port'], status: 1, key: randomId()});
      }
    }
  });

  var style = {

    opacity: opacityy,
    transitionDuration: transitionn

  };

  function Copy(){
    navigator.clipboard.writeText(IP);

    setTransition('0.2s');
    setOpacity('1');

    setTimeout(()=>{
      setTransition('0.5s');
      setOpacity('0');
    }, 2000);

  }

  // ------------------------------------------ <HTML PART> ------------------------------------------

  return (
    
    <div className='page-main-container'>
      <div className='page-title-container'>
        <p className='page-title'>Dashboard</p>
      </div>
      <div className='page-content' id='dc'>
        <div className='dashboard-left' id="dl">
          <div className='servcard-container'>
            <p className='last-serv'>Last server launched</p>
            { scanned ?
              lastServ === undefined || JSON.stringify(lastServ) === "{}"?
              <div className='not-launched' id="nl">
                <p className='title'>Seems like you haven't</p>
                <p className='title'>launched any server so far!</p>
                <div className='click-to-servers'>
                  <p>Go check </p><Link to={{pathname:`/servers`}} >Servers</Link><p> to start one</p>
                </div>
                
              </div>
              :
              <ServCard status={lastServ['status']} name={lastServ['name']} api={lastServ['api']} version={lastServ['version']} port={lastServ['port']} dir={lastServ['path']} key={lastServ['key']}/>

              :
              <></>
            }
          </div>

          <div className='ip-card-container' id="ic">

            <div className='ip-title-container'>
              <FontAwesomeIcon className='ip-icon' icon={faGlobe}/>
              <p className='ip-title'>Your IP</p>
              <p className='copy-link' onClick={() => Copy()}>Click to copy</p>
            </div>

            <div className='ip-container' onClick={() => Copy()}>
              <div className='copied-msg' style={style}>
                <p className='copied'>Copied!</p>
                <div className='arrow'></div>
              </div>
                
              <p className='ip' tabIndex="1">{IP}</p>
            </div>
          </div>
        </div>
        <div className='dashboard-right' id="dr">
          <Whadis/>
        </div>
        
      </div>
    </div>
  );
}

export default Dashboard;
