import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/FinalLogo.png';
import Browse from '../components/Browse';
import AnimeSearch from '../components/animeCards/AnimeSearch';
import Favorites from '../components/pageFeatures/Favorites';
import styled from 'styled-components';

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

    const TopNavbar = styled.nav`
        background-color: #111920;
    `;
    
    return (
        <>
        <TopNavbar className="navbar navbar-expand-lg navbar-dark d-flex justify-content-between p-2">
            <div className="container-fluid">                
                <Link to="/profile" className="navbar-brand">
                    <strong>My Profile</strong>
                </Link>
                <Link to="/dashboard" className="navbar-brand ml-auto">
                    <img src={logo} alt="Big Logo" className="logo img-fluid mr-3" style={{ minHeight: '50px', maxHeight: '50px' }} />
                </Link>
                <div className="ml-auto">
                    <button onClick={handleLogOut} className="btn btn-danger">
                        <strong>Log Out</strong>
                    </button>
                </div>
            </div>
        </TopNavbar>
        <div style={{ background: "linear-gradient(to bottom, #2e77AE, #000000)", minHeight: '100vh' }}>
        <div className="container-fluid p-3">
            <div className="row">
                <div className="col">
                    <div className="d-flex justify-content-center">
                        <button onClick={toggleSearch} className={`btn btn-primary btn-lg mx-2 ${showSearch ? 'active' : ''}`}>Search</button>
                        <button onClick={toggleBrowse} className={`btn btn-danger btn-lg mx-2 ${showBrowse ? 'active' : ''}`}>Browse</button>
                        <button onClick={toggleFavorites} className={`btn btn-light btn-lg mx-2 ${showFavorites ? 'active' : ''}`}>Favorites</button>
                    </div>
                </div>
            </div>
        </div>

        {showSearch && <AnimeSearch typeDefault={"topAnime"} />}
        {showBrowse && <Browse />}
        {showFavorites && <Favorites />}
        </div>
        </>
    );
};

export default Dashboard;
