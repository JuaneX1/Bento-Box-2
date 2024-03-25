import React, { useState } from 'react';
import './App.css';
import Modal from './Modal';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import backgroundVideo from './assets/animeclip1.mp4';
import logo from './assets/FinalLogo.png';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './DashboardPage';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeForm, setActiveForm] = useState('login');

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const switchForm = (form) => {
    setActiveForm(form);
    setIsModalOpen(true);
  };

  return (
    <BrowserRouter>
      <div className="App">
        <div className="video-overlay"></div>
        <video autoPlay loop muted id="background-video">
          <source src={backgroundVideo} type="video/mp4" />
        </video>
        <div className="topbar">
          <img src={logo} alt="Logo" className="topbar-logo" />
          <div className="buttons-container">
            <button className="topbar-btn">Home</button>
            <button className="topbar-btn">Services</button>
            <button className="topbar-btn">Products</button>
            <button className="get-started-btn" onClick={() => switchForm('login')}>GET STARTED</button>
          </div>
        </div>
        <Modal isOpen={isModalOpen} onClose={() => {
          toggleModal();
          setActiveForm('login');
        }}>
          {activeForm === 'login' ? (
            <LoginForm 
              onClose={() => {
                toggleModal();
                setActiveForm('login');
              }} 
              onSwitchForm={() => switchForm('signup')} 
            />
          ) : (
            <SignUpForm 
              onClose={() => {
                toggleModal();
                setActiveForm('login');
              }} 
              onSwitchBack={() => switchForm('login')}
            />
          )}
        </Modal>
        {}
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          {}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;