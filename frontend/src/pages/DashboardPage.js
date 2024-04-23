import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/FinalLogo.png';
import Browse from '../components/Browse';
import AnimeSearch from '../components/animeCards/AnimeSearch';
import Favorites from '../components/pageFeatures/Favorites';
import DailyBox from '../components/pageFeatures/DailyBox'; 
import styled from 'styled-components';

const Dashboard = () => {
    const navigate = useNavigate();
    const [showSearch, setShowSearch] = useState(true);
    const [showBrowse, setShowBrowse] = useState(false);
    const [showFavorites, setShowFavorites] = useState(false);
    const [showDailyBox, setShowDailyBox] = useState(false); 

    const handleLogOut = () => {
        navigate('/');
    };

    const toggleSearch = () => {
        if (!showSearch) {
            setShowSearch(true);
            setShowBrowse(false);
            setShowFavorites(false);
            setShowDailyBox(false); 
        }
    };
    
    const toggleBrowse = () => {
        if (!showBrowse) {
            setShowBrowse(true);
            setShowSearch(false);
            setShowFavorites(false);
            setShowDailyBox(false); 
        }
    };
    
    const toggleFavorites = () => {
        if (!showFavorites) {
            setShowBrowse(false);
            setShowSearch(false);
            setShowFavorites(true);
            setShowDailyBox(false); 
        }
    };

    const toggleDailyBox = () => {
        setShowDailyBox(!showDailyBox); 
        setShowBrowse(false);
        setShowSearch(false);
        setShowFavorites(false);
    };

    const TopNavbar = styled.nav`
        background-color: #111920;
    `;

    const CustomLink = styled.div`
        border: none;
        transition: all 0.3s ease;

        &:hover,
        &:focus {
        border: 2px solid white;
        transform: scale(1.05);
        }
`;

    const CustomPrimaryButton = styled.button`
        background-color: #111920;
        border: none;
        transition: all 0.3s ease;

        &:hover,
        &:focus {
        background-color: #111920;

        border: 2px solid white;
        transform: scale(1.05);
        }
    `;
    
    return (
        <>
        <TopNavbar className="navbar navbar-expand-lg navbar-dark d-flex justify-content-between p-2">
            <div className="container-fluid">      
            <CustomLink className='p-2 ml-2 navbar-brand'>   
                <Link to="/profile" className="text-white text-decoration-none">
                    <strong>My Profile</strong>
                </Link>
                </CustomLink>       
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
                        <CustomPrimaryButton onClick={toggleSearch} style={{backgroundColor: "#111920"}} className={`text-white btn rounded-lg mx-2 ${showSearch ? 'active' : 'active'}`}>Search</CustomPrimaryButton>
                        <button onClick={toggleBrowse} className={`btn btn-danger btn-lg mx-2 ${showBrowse ? 'active' : ''}`}>Browse</button>
                        <button onClick={toggleFavorites} className={`btn btn-light btn-lg mx-2 ${showFavorites ? 'active' : ''}`}>Favorites</button>
                        <button onClick={toggleDailyBox} className={`btn btn-secondary btn-lg mx-2 ${showDailyBox ? 'active' : ''}`}>For You!</button> {/* Add button for Daily Box */}
                    </div>
                </div>
            </div>
        </div>

        {showSearch && <AnimeSearch typeDefault={"topAnime"} />}
        {showBrowse && <Browse />}
        {showFavorites && <Favorites />}
        {showDailyBox && <DailyBox />} 
        </div>
        </>
    );
};

export default Dashboard;
