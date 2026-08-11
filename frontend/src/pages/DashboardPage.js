import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/FinalLogo.png';
import Browse from '../components/Browse';
import AnimeSearch from '../components/animeCards/AnimeSearch';
import DailyBox from '../components/pageFeatures/DailyBox';
import styled from 'styled-components';

const Dashboard = () => {
    const [showSearch, setShowSearch] = useState(true);
    const [showBrowse, setShowBrowse] = useState(false);
    const [showDailyBox, setShowDailyBox] = useState(false);

    const toggleSearch = () => {
        if (!showSearch) {
            setShowSearch(true);
            setShowBrowse(false);
            setShowDailyBox(false);
        }
    };

    const toggleBrowse = () => {
        if (!showBrowse) {
            setShowBrowse(true);
            setShowSearch(false);
            setShowDailyBox(false);
        }
    };

    const toggleDailyBox = () => {
        setShowDailyBox(!showDailyBox);
        setShowBrowse(false);
        setShowSearch(false);
    };

    const TopNavbar = styled.nav`
        background-color: #111920;
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
                <Link to="/" className="navbar-brand ml-auto">
                    <img src={logo} alt="Big Logo" className="logo img-fluid mr-3" style={{ minHeight: '50px', maxHeight: '50px' }} />
                </Link>
            </div>
        </TopNavbar>
        <div style={{ background: "linear-gradient(to bottom, #2e77AE, #000000)", minHeight: '100vh' }}>
        <div className="container-fluid p-3">
            <div className="row">
                <div className="col">
                    <div className="d-flex justify-content-center">
                        <CustomPrimaryButton onClick={toggleSearch} style={{backgroundColor: "#111920"}} className={`text-white btn rounded-lg mx-2 ${showSearch ? 'active' : 'active'}`}>Search</CustomPrimaryButton>
                        <button onClick={toggleBrowse} className={`text-black btn btn-danger btn-lg mx-2 text-black ${showBrowse ? 'active' : ''}`}>Browse</button>
                        <button onClick={toggleDailyBox} className={`btn btn-secondary btn-lg mx-2 ${showDailyBox ? 'active' : ''}`}>For You!</button>
                    </div>
                </div>
            </div>
        </div>

        {showSearch && <AnimeSearch typeDefault={"topAnime"} />}
        {showBrowse && <Browse />}
        {showDailyBox && <DailyBox />}
        </div>
        </>
    );
};

export default Dashboard;
