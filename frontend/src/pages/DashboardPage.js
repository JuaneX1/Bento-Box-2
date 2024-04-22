import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/FinalLogo.png';
import Browse from '../components/Browse';
import AnimeSearch from '../components/animeCards/AnimeSearch';
import Favorites from '../components/pageFeatures/Favorites';
import '../css/DashboardPage.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [showSearch, setShowSearch] = useState(true);
    const [showBrowse, setShowBrowse] = useState(false);
    const [showFavorites, setShowFavorites] = useState(false);

    const handleLogOut = () => {
        navigate('/');
    };

    const toggleSearch = () => {
        if (!showSearch) {
            setShowSearch(true);
            setShowBrowse(false);
            setShowFavorites(false);
        }
    };
    
    const toggleBrowse = () => {
        if (!showBrowse) {
            setShowBrowse(true);
            setShowSearch(false);
            setShowFavorites(false);
        }
    };
    
    const toggleFavorites = () => {
        if (!showFavorites) {
            setShowBrowse(false);
            setShowSearch(false);
            setShowFavorites(true);
        }
    };
    
    return (
        <div className="dashboard">
            <header className="topbar">
                <Link to="/profile" className="topbar-btn">My Profile</Link>
                <img src={logo} alt="Logo" className="topbar-logo" />
                <button onClick={handleLogOut} className="log-out-btn">Log Out</button>
            </header>

            <div className="navigation-buttons">
                <button onClick={toggleSearch} className={`navigation-btn navigation-btn-blue ${showSearch}`}>Search</button>
                <button onClick={toggleBrowse} className={`navigation-btn navigation-btn-red ${showBrowse ? 'active' : ''}`}>Browse</button>
                <button onClick={toggleFavorites} className={`navigation-btn navigation-btn-white ${showFavorites}`}>Favorites</button>
            </div>

            {showSearch && <AnimeSearch typeDefault={"topAnime"} />}
            {showBrowse && <Browse />}
            {showFavorites && <Favorites />}
        </div>
    );
};

export default Dashboard;
