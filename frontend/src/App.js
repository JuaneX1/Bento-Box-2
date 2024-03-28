import React from 'react';
// import { useState } from 'react'; // Commented out as not used
import './App.css';
// import Modal from './Modal';
// import LoginForm from './LoginForm';
// import SignUpForm from './SignUpForm';
// import backgroundVideo from './assets/animeclip1.mp4';
// import logo from './assets/FinalLogo.png';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './DashboardPage';
import HomePage from './HomePage'; // Keep import for HomePage
import Verification from './Verification';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/Verification" element={<Verification />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
