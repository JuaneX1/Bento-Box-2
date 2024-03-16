import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css';
import logo from './assets/FinalLogo.png';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogOut = () => {

    navigate('/');
  };

  return (
    <div className="dashboard">
      <header className="topbar">
        <img src={logo} alt="Logo" className="topbar-logo" />
        <button onClick={handleLogOut} className="log-out-btn">Log Out</button>
      </header>
      {}
    </div>
  );
};

export default Dashboard;
