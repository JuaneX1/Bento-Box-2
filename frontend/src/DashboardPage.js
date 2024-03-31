import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/DashboardPage.css';
import logo from './assets/FinalLogo.png';
import MainContent from './MainContent';

const Dashboard = () => {
  const navigate = useNavigate();
  const [animeList, SetAnimeList] = useState([]);
  const [search, SetSearch] = useState("");
  const [topAnime, SetTopAnime] = useState([]);

  useEffect(() => {
    FetchTopAnime();
  }, []);

  const HandleSearch = e => {
    e.preventDefault();
    FetchAnime(search);
  }

  const FetchAnime = async (query) => {
    const temp = await fetch(`https://api.jikan.moe/v4/anime?q=${query}&order_by=title&sort=asc&limit=10`)
      .then(res => res.json());

    SetAnimeList(temp.data);
  };

  // Function to fetch top current anime
  const FetchTopAnime = async () => {
    // Adjust the URL based on the API for fetching top current anime
    const temp = await fetch(`https://api.jikan.moe/v4/top/anime?filter=bypopularity&limit=20`)
      .then(res => res.json());

    SetTopAnime(temp.data); // Assuming the API response format is the same
  };

  const handleLogOut = () => {
    navigate('/');
  };

  return (
    <div className="dashboard">
      <header className="topbar">
        <img src={logo} alt="Logo" className="topbar-logo" />
        <button onClick={handleLogOut} className="log-out-btn">Log Out</button>
      </header>

      <div className="content-wrap">
        <MainContent
          HandleSearch={HandleSearch}
          search={search}
          SetSearch={SetSearch}
          animeList={search ? animeList : topAnime}
        />
      </div>
    </div>
  );
};

export default Dashboard;