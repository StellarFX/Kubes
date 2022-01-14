import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Dashboard from './Pages/Dashboard';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Navbar from './components/Navbar/Navbar';

ReactDOM.render(
  <div className='main-container'>
    <Navbar />
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>

    </Router>
  </div>
  ,
  document.getElementById('main')
);
