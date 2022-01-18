import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Dashboard from './Pages/Dashboard';
import Servers from './Pages/Servers';
import ServerManage from './Pages/ServerManage';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Navbar from './components/Navbar/Navbar';

ReactDOM.render(
  <div className='main-container'>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/dashboard" element={<Dashboard />}/>
        <Route path="/servers" element={<Servers />} />
        <Route path="/server/:id/:config" element={<ServerManage />} />
      </Routes>

    </Router>
  </div>
  ,
  document.getElementById('main')
);
