import ServCard from '../components/ServCard/ServCard.jsx';
import Whadis from '../components/Whadis/Whadis.jsx';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import './Dashboard.scss';

function Dashboard() {

  const IP = '90.35.227.53';

  const [opacityy, setOpacity] = useState('0');
  const [transitionn, setTransition] = useState('0.2s');

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

    //  no u wew tozik
    // uwu owo iwi

  }

  // ------------------------------------------ <HTML PART> ------------------------------------------

  return (
    
    <div className='page-main-container'>
      <p className='page-title'>Dashboard</p>
      <div className='page-content' id='dc'>
        <div className='dashboard-left' id="dl">
          <div className='servcard-container'>
            <p className='last-serv'>Last server launched</p>
            <ServCard status="1"/>
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
                
              <p className='ip' tabindex="1">{IP}</p>
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
