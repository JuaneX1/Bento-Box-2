import React, { useEffect, useState } from 'react';
import './HomePage.css';
import AnimeList from './AnimeList';
import AnimeInfo from './AnimeInfo';
import bigLogo from './BB_Logo_Horizontal_COLOR_1.png';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';

const HomePage = () => {
    const [search, setSearch] = useState();
    const [animeData, setAnimeData] = useState();
    const [animeInfo, setAnimeInfo] = useState();
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [showSignUpForm, setShowSignUpForm] = useState(false);

    const getData = async () => {
        const res = await fetch(`https://api.jikan.moe/v4/seasons/2024/spring`);
        const resData = await res.json();
        setAnimeData(resData.data);
    };

    useEffect(() => {
        getData();
    }, [search]);

    const handleLoginButtonClick = () => {
        setShowLoginForm(true);
        setShowSignUpForm(false);
    };

    const handleSignUpButtonClick = () => {
        setShowSignUpForm(true);
        setShowLoginForm(false);
    };

    const handleCloseForms = () => {
        setShowLoginForm(false);
        setShowSignUpForm(false);
    };

    const handleSwitchToLogin = () => {
        setShowLoginForm(true);
        setShowSignUpForm(false);
    };

    const handleSwitchToSignUp = () => {
        setShowSignUpForm(true);
        setShowLoginForm(false);
    };

    return (
        <>
            <div className="topbar">
                <button className="about-us-button">About Us</button>
            </div>

            <div className='container'>
                <div className='anime-row'>
                    <div className='row'>
                        <AnimeList
                            animelist={animeData}
                            setAnimeInfo={setAnimeInfo}
                        />
                    </div>
                </div>
                <div className="logo-and-form-container">
                    {showLoginForm ? (
                        <LoginForm onClose={handleCloseForms} onSwitchForm={handleSwitchToSignUp} />
                    ) : showSignUpForm ? (
                        <SignUpForm onClose={handleCloseForms} onSwitchBack={handleSwitchToLogin} />
                    ) : (
                        <div className="logo-container">
                            <img src={bigLogo} alt="Big Logo" />
                            <div className="buttons">
                                <button className="button" onClick={handleLoginButtonClick}>Login</button>
                                <button className="button" onClick={handleSignUpButtonClick}>Sign Up</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default HomePage;
