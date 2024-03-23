import React, { useEffect, useState } from 'react';
import './HomePage.css';
import AnimeList from './AnimeList';
import AnimeInfo from './AnimeInfo';
import bigLogo from './BB_Logo_Horizontal_COLOR_1.png';
import Dashboard from './DashboardPage';

const HomePage = () => {
    const [search, setSearch] = useState();
    const [animeData, setAnimeData] = useState();
    const [animeInfo, setAnimeInfo] = useState();

    const getData = async () => {
        const res = await fetch(`https://api.jikan.moe/v4/seasons/2024/spring`);
        const resData = await res.json();
        setAnimeData(resData.data);
    }

    useEffect(() => {
        getData();
    }, [search]);

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
                <div className="logo-container">
                    <img src={bigLogo} alt="Big Logo" />
                    <div className="buttons">
                        <button className="button">Login</button>
                        <button className="button">Sign Up</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default HomePage;
