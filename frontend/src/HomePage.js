import React, { useEffect, useState } from 'react';
import './HomePage.css';
import AnimeList from './AnimeList';
import bigLogo from './BB_Logo_Horizontal_COLOR_1.png';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import ForgotPassword from './ForgotPassword';

const HomePage = () => {
    const [search, setSearch] = useState();
    const [animeData, setAnimeData] = useState();
    const [currentForm, setCurrentForm] = useState('');

    const getData = async () => {
        const res = await fetch(`https://api.jikan.moe/v4/seasons/2024/spring`);
        const resData = await res.json();
        setAnimeData(resData.data);
    };

    useEffect(() => {
        getData();
    }, [search]);

    const handleSwitchForm = (formType) => {
        setCurrentForm(formType);
    };

    const handleCloseForms = () => {
        setCurrentForm('');
    };

    return (
        <>
            <div className="topbar">
                <button className="about-us-button">About Us</button>
            </div>
            <div className='container'>
                <div className='anime-row'>
                    <div className='row'>
                        <AnimeList animelist={animeData} />
                    </div>
                </div>
                <div className="logo-and-form-container">
                    {currentForm === 'login' ? (
                        <LoginForm onClose={handleCloseForms} onSwitchForm={() => handleSwitchForm('signup')} onShowForgotPassword={() => handleSwitchForm('forgot')} />
                    ) : currentForm === 'signup' ? (
                        <SignUpForm onClose={handleCloseForms} onSwitchBack={() => handleSwitchForm('login')} />
                    ) : currentForm === 'forgot' ? (
                        <ForgotPassword onClose={handleCloseForms} onSwitchForm={() => handleSwitchForm('login')} />
                    ) : (
                        <div className="logo-container">
                            <img src={bigLogo} alt="Big Logo" />
                            <div className="buttons">
                                <button className="button" onClick={() => handleSwitchForm('login')}>Login</button>
                                <button className="button" onClick={() => handleSwitchForm('signup')}>Sign Up</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default HomePage;
