import React, { useState, useEffect } from 'react';

import { useNavigate, Link } from 'react-router-dom';
import '../css/DashboardPage.css';
import logo from '../assets/FinalLogo.png';
import AnimeSearch from '../components/animeCards/AnimeSearch';
import Browse from '../components/Browse';

const Dashboard = () => {
    const navigate = useNavigate();
    const [showSearch, setShowSearch] = useState(true);
    const [showBrowse, setShowBrowse] = useState(false);

    const handleLogOut = () => {
        navigate('/');
    };

    const toggleSearch = () => {
        setShowSearch(!showSearch);
        if (showBrowse) setShowBrowse(false);
    };

    const toggleBrowse = () => {
        setShowBrowse(!showBrowse);
        if (showSearch) setShowSearch(false);
    };

    return (
        <div className="dashboard">
            <header className="topbar">
                <Link to="/profile" className="topbar-btn">My Profile</Link>
                <img src={logo} alt="Logo" className="topbar-logo" />
                <button onClick={handleLogOut} className="log-out-btn">Log Out</button>
            </header>

            <div className="navigation-buttons">
                <button onClick={toggleSearch} className={`navigation-btn navigation-btn-blue ${showSearch ? 'active' : ''}`}>Search</button>
                <button onClick={toggleBrowse} className={`navigation-btn navigation-btn-red ${showBrowse ? 'active' : ''}`}>Browse</button>
                <button className="navigation-btn navigation-btn-white" disabled>Favorites</button>
            </div>

            {showSearch && <AnimeSearch typeDefault={"topAnime"} />}
            {showBrowse && <Browse />}
        </div>
    );
};

export default Dashboard;
