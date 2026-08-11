import React, { useEffect, useRef, useState } from "react";
import bigLogo from "../assets/BB_Logo_Horizontal_COLOR_1.png";
import AnimeList from "../components/animeCards/AnimeList";
import { Link, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import fetchJikan from '../utils/fetchJikan';

const HomePage = () => {
  const navigate = useNavigate();
  const [animeData, setAnimeData] = useState();
  const animeRowRef = useRef(null);

  // gets the animes to display in sidebar, 24 is to make it flush since in 3 by 3 grid
  const getData = async () => {
    try {
      const resData = await fetchJikan(
        `https://api.jikan.moe/v4/seasons/now?limit=24`
      );
      setAnimeData(resData.data);
    } catch (error) {
      console.error('Error fetching seasonal anime, falling back to top anime:', error);
      try {
        const fallbackData = await fetchJikan(`https://api.jikan.moe/v4/top/anime?limit=24`);
        setAnimeData(fallbackData.data);
      } catch (fallbackError) {
        console.error('Error fetching fallback anime:', fallbackError);
      }
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (animeRowRef.current) {
        animeRowRef.current.scrollTop += 1;
        if (animeRowRef.current.scrollTop >= animeRowRef.current.scrollHeight - animeRowRef.current.clientHeight) {
          animeRowRef.current.scrollTop = 0;
        }
      }
    }, 50); // Speed of scroll - lower is faster. Adjust as needed.

    return () => clearInterval(interval);
  }, []);

  const TopNavbar = styled.nav`
    background-color: #111920;
  `;

  const CustomPrimaryButton = styled.button`
    background-color: #111920;
    border: none;
    transition: all 0.3s ease;

    &:hover,
    &:focus {
      border: 2px solid white;
      transform: scale(1.05);
    }
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

  return (
    <>
      <TopNavbar className="navbar navbar-expand-lg navbar-dark d-flex justify-content-between p-2">
        <Link to="/" className="navbar-brand">
          <img src={bigLogo} alt="Big Logo" className="logo img-fluid mr-3" style={{ minHeight: '50px', maxHeight: '50px' }} />
        </Link>
        <div className="navbar-brand ml-auto">
          <CustomLink className="nav-link p-2" >
            <Link className="text-white text-decoration-none" to="/about-us"><strong>About Us</strong></Link>
          </CustomLink>
        </div>
      </TopNavbar>
      <div style={{ background: "linear-gradient(to left, #2e77AE, #000000)" }}>
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="anime-row overflow-hidden" style={{ minHeight: "92.4vh", maxHeight: "200px", overflowY: "scroll" }} ref={animeRowRef}>
                <div className="row">
                  <AnimeList animelist={animeData} />
                </div>
              </div>
            </div>
            <div className="col-md-6 d-flex align-items-center justify-content-center">
              <div className="logo-and-form-container">
                <div className="logo-container text-center">
                  <img src={bigLogo} alt="Big Logo" className="img-fluid mb-4" style={{ maxWidth: "100%", height: "auto", width: "500px" }} />
                  <div className="buttons p-4 d-flex justify-content-center">
                    <CustomPrimaryButton
                      className="btn btn-secondary btn-lg btn-common p-3"
                      onClick={() => navigate("/dashboard")}
                    >
                      Enter Site
                    </CustomPrimaryButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
