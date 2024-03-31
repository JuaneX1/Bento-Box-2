import React, { useEffect, useState, useRef } from 'react';
import './HomePage.css';
import AnimeList from './AnimeList';
import bigLogo from './assets/BB_Logo_Horizontal_COLOR_1.png';
import LoginForm from './LoginForm';
import LoginForm2 from './LoginForm2';
import SignUpForm from './SignUpForm';
import ForgotPassword from './ForgotPassword';

const HomePage = () => {
    const [search, setSearch] = useState();
    const [animeData, setAnimeData] = useState();
    const [currentForm, setCurrentForm] = useState('');
    const animeRowRef = useRef(null);

    const getData = async () => {
        const res = await fetch(`https://api.jikan.moe/v4/seasons/2024/spring`);
        const resData = await res.json();
        setAnimeData(resData.data);
    };

    useEffect(() => {
        getData();
    }, [search]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (animeRowRef.current) {
                const maxScroll = animeRowRef.current.scrollHeight - animeRowRef.current.clientHeight;
                if (animeRowRef.current.scrollTop < maxScroll) {
                    animeRowRef.current.scrollBy(0, 1);
                } else {
                    animeRowRef.current.scrollTop = 0; // Reset scroll to top when it reaches the bottom
                }
            }
        }, 50); // Speed of scroll - lower is faster. Adjust as needed.

        return () => clearInterval(interval);
    }, []);

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
                <div className='anime-row' ref={animeRowRef}>
                    <div className='row'>
                        <AnimeList animelist={animeData} />
                    </div>
                </div>
                <div className="logo-and-form-container">
                    {currentForm === '' && (
                        <div className="logo-container">
                            <img src={bigLogo} alt="Big Logo" />
                            <div className="buttons">
                                <button className="button" onClick={() => handleSwitchForm('login')}>Login</button>
                                <button className="button" onClick={() => handleSwitchForm('signup')}>Sign Up</button>
                            </div>
                        </div>
                    )}
                    {currentForm === 'login' && (
                        <LoginForm onClose={handleCloseForms} onSwitchForm={handleSwitchForm} onShowForgotPassword={() => handleSwitchForm('forgot')} />
                    )}
                    {currentForm === 'LoginForm2' && (
                        <LoginForm2 onClose={handleCloseForms} onSwitchForm={handleSwitchForm} />
                    )}
                    {currentForm === 'signup' && (
                        <SignUpForm onClose={handleCloseForms} onSwitchBack={() => handleSwitchForm('login')} />
                    )}
                    {currentForm === 'forgot' && (
                        <ForgotPassword onClose={handleCloseForms} onSwitchForm={() => handleSwitchForm('login')} />
                    )}
                </div>
            </div>
        </>
    );
};

export default HomePage;
