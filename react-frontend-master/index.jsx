import React from 'react';
import ReactDOM from 'react-dom';
// import './index.scss';
import Dashboard from './Pages/Dashboard/Dashboard';
import Servers from './Pages/Servers/Servers';
import ServerManage from './Pages/ServerManage/ServerManage';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Navbar from './components/Navbar/Navbar';
import Preferences from './Pages/Preferences/Preferences';
import About from './Pages/About/About';
import Donate from './Pages/Donate/Donate';

function WithNavbar(props) {
  
  return (
    <div className='main-container'>
      <Navbar/>
      {props.children}
    </div>
  )
}

ReactDOM.render(
    <Router>
      <Routes>
        <Route path="/dashboard" element={<WithNavbar><Dashboard/></WithNavbar>}/>
        <Route path="/servers" element={<WithNavbar><Servers /></WithNavbar>}/>
        <Route path="/server/:id/*" element={<WithNavbar><ServerManage /></WithNavbar>} />
        <Route path="/preferences" element={<WithNavbar><Preferences /></WithNavbar>}/>
        <Route path="/about" element={<WithNavbar><About /></WithNavbar>}/>
        <Route path="/donate" element={<WithNavbar><Donate /></WithNavbar>}/>
      </Routes>
    </Router>
  ,
  document.getElementById('main')
);
