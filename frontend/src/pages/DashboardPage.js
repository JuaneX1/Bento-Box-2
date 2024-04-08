import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../css/DashboardPage.css';
import logo from '../assets/FinalLogo.png';
import AnimeSearch from '../components/animeCards/AnimeSearch';
import Browse from '../components/Browse';

const Dashboard = () => {
    const navigate = useNavigate();
    // State to manage the visibility
    const [showSearch, setShowSearch] = useState(false);
    const [showBrowse, setShowBrowse] = useState(false);

    const handleLogOut = () => {
        navigate('/');
    };

    // Toggle visibility functions
    const toggleSearch = () => {
        setShowSearch(!showSearch);
        if (showBrowse) setShowBrowse(false); // Close Browse if open
    };

    const toggleBrowse = () => {
        setShowBrowse(!showBrowse);
        if (showSearch) setShowSearch(false); // Close Search if open
    };

    return (
        <div className="dashboard">
            <header className="topbar">
                <Link to="/profile" className="topbar-btn">My Profile</Link>
                <img src={logo} alt="Logo" className="topbar-logo" />
                <button onClick={handleLogOut} className="log-out-btn">Log Out</button>
            </header>

            <div className="navigation-buttons">
                <button onClick={toggleSearch} className="navigation-btn">Search</button>
                <button onClick={toggleBrowse} className="navigation-btn">Browse</button>
                <button className="navigation-btn" disabled>Favorites</button>
            </div>

            {showSearch && <AnimeSearch typeDefault={"topAnime"} />}
            {showBrowse && <Browse />}
        </div>
    );
};

export default Dashboard;
