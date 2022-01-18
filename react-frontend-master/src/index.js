import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Dashboard from './Pages/Dashboard';
import Servers from './Pages/Servers';
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
      </Routes>

    </Router>
  </div>
  ,
  document.getElementById('main')
);
