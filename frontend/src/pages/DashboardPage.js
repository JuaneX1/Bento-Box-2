import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/FinalLogo.png';
import Browse from '../components/Browse';
import AnimeSearch from '../components/animeCards/AnimeSearch';
import DailyBox from '../components/pageFeatures/DailyBox';
import '../components/Stylesheet.css';

const COMPARTMENTS = [
    { key: 'search', label: 'Search' },
    { key: 'browse', label: 'Browse' },
    { key: 'forYou', label: 'For You' },
];

const Dashboard = () => {
    const [activeCompartment, setActiveCompartment] = useState('search');

    return (
        <>
        <nav className="navbar navbar-expand-lg navbar-dark d-flex justify-content-between p-2" style={{ backgroundColor: 'var(--ink)', borderBottom: '1px solid var(--blue-shade)' }}>
            <div className="container-fluid">
                <Link to="/" className="navbar-brand ml-auto">
                    <img src={logo} alt="Big Logo" className="logo img-fluid mr-3" style={{ minHeight: '50px', maxHeight: '50px' }} />
                </Link>
            </div>
        </nav>
        <div style={{ backgroundColor: 'var(--void)', minHeight: '100vh' }}>
            <div className="container-fluid px-3 pt-4">
                <div className="tray mx-auto" style={{ maxWidth: '1100px' }}>
                    <div className="tray-tabs justify-content-center">
                        {COMPARTMENTS.map(compartment => (
                            <button
                                key={compartment.key}
                                onClick={() => setActiveCompartment(compartment.key)}
                                className={`tray-tab ${activeCompartment === compartment.key ? 'is-active' : ''}`}
                            >
                                {compartment.label}
                            </button>
                        ))}
                    </div>
                    <div className="tray-content" key={activeCompartment}>
                        {activeCompartment === 'search' && <AnimeSearch typeDefault={"topAnime"} />}
                        {activeCompartment === 'browse' && <Browse />}
                        {activeCompartment === 'forYou' && <DailyBox />}
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default Dashboard;
