import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../css/DashboardPage.css';
import logo from '../assets/FinalLogo.png';
import AnimeSearch from '../components/animeCards/AnimeSearch';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogOut = () => {
    navigate('/');
  };

  return (
    <div className="dashboard">
      <header className="topbar">
        <Link to="/profile" className="topbar-btn">My Profile</Link>
        <img src={logo} alt="Logo" className="topbar-logo" />
        <button onClick={handleLogOut} className="log-out-btn">Log Out</button>
      </header>
      
      <AnimeSearch typeDefault={"topAnime"} />
    </div>
  );
};

export default Dashboard;
