import React, { useEffect, useState } from "react";
import bigLogo from "../assets/BB_Logo_Horizontal_COLOR_1.png";
import AnimeList from "../components/animeCards/AnimeList";
import { Link, useNavigate } from "react-router-dom";
import '../components/Stylesheet.css';
import { fetchSeasonalAnime, getCurrentSeason, fetchTopAnime } from '../utils/fetchAniList';

const HomePage = () => {
  const navigate = useNavigate();
  const [animeData, setAnimeData] = useState();

  // gets the animes to display in the marquee rail, 24 is to make it flush since in 3 by 3 grid
  const getData = async () => {
    try {
      const { season, seasonYear } = getCurrentSeason();
      const resData = await fetchSeasonalAnime(season, seasonYear, 1, 24);
      setAnimeData(resData);
    } catch (error) {
      console.error('Error fetching seasonal anime, falling back to top anime:', error);
      try {
        const fallbackData = await fetchTopAnime(1, 24);
        setAnimeData(fallbackData);
      } catch (fallbackError) {
        console.error('Error fetching fallback anime:', fallbackError);
      }
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark p-2" style={{ backgroundColor: 'var(--ink)', borderBottom: '1px solid var(--blue-shade)' }}>
        <Link to="/" className="navbar-brand">
          <img src={bigLogo} alt="Big Logo" className="logo img-fluid mr-3" style={{ minHeight: '50px', maxHeight: '50px' }} />
        </Link>
      </nav>
      <div style={{ backgroundColor: 'var(--void)', minHeight: 'calc(100vh - 66px)' }}>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6 p-0">
              <div className="marquee-viewport overflow-hidden" style={{ height: 'calc(100vh - 66px)' }}>
                <div className="marquee-track">
                  <AnimeList animelist={animeData} />
                  <AnimeList animelist={animeData} />
                </div>
              </div>
            </div>
            <div className="col-md-6 d-flex align-items-center justify-content-center">
              <div className="text-center p-4">
                <img src={bigLogo} alt="Big Logo" className="d-block mx-auto img-fluid mb-4" style={{ maxWidth: "100%", height: "auto", width: "460px" }} />
                <button
                  className="btn-bento-primary px-5 py-3"
                  onClick={() => navigate("/dashboard")}
                >
                  Enter Site
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
