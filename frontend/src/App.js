import React from 'react';
import axios from 'axios';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './DashboardPage';
import HomePage from './HomePage';
import Verify from './Verify';

const instance = axios.create({
	baseURL: 'http://localhost:5000/api'
});

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/verify/:objId" element={<Verify />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export { instance, generateToken };
export default App;
