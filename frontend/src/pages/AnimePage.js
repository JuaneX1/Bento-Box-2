import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { BsHeart, BsHeartFill } from 'react-icons/bs';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { instance } from '../App';
import bigLogo from '../assets/BB_Logo_Horizontal_COLOR_1.png';
import highScoreImage from '../assets/highScoreImg.webp';
import lowScoreImage from '../assets/lowScoreImg.png';
import mediumScoreImage from '../assets/mediumScoreImg.png';

const AnimePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [animeData, setAnimeData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHeart, setShowHeart] = useState(true);
  const [buttonText, setButtonText] = useState('Favorite');

  const toggleFavorite = async () => {
    try {
      const response = await instance.post(`/setFavorite/`, { mal_id: id }, { headers: { Authorization: sessionStorage.getItem('token') } });
      const message = response.data.message;
      
      if (message === "Removing Favorite") {
        setButtonText('Favorite');
        setShowHeart(true);
      }
      else if (message === "Adding Favorite") {
        setButtonText('Unfavorite');
        setShowHeart(false);
      }

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      try {
        const response = await instance.get(`https://api.jikan.moe/v4/anime/${id}`);
        const data = response.data;
        const anime = data.data;
        setAnimeData(anime);
		const favoritesArr = await instance.get(`/getFavorite`, { headers: { Authorization: sessionStorage.getItem('token') } });
        
       
		if (favoritesArr.data.includes(anime.mal_id.toString())) {
			setButtonText('Unfavorite');
			setShowHeart(false);
		}
        setLoading(false);
      } catch (error) {
        console.error('Error fetching anime details:', error);
        setLoading(false);
      }
    };

    const fetchAnimeRecommendations = async () => {
      try {
        const response = await instance.get(`https://api.jikan.moe/v4/anime/${id}/recommendations`);
        const data = response.data;
        const animeRecommendationsList = data.data.slice(0, 3);

        setRecommendations(animeRecommendationsList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching anime recommendations:', error);
        setLoading(false);
      }
    };

    fetchAnimeDetails();
    fetchAnimeRecommendations();
  }, [id]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  const handleLogOut = () => {
    navigate('/');
  };  

  const TopNavbar = styled.nav`
    background-color: #111920;
  `;

  

  return (
    <div className="anime-container">
      <TopNavbar className="navbar navbar-expand-lg navbar-dark d-flex justify-content-between p-2">
        <div className="container-fluid">
          <Link to="/dashboard" className="navbar-brand">
            <strong>Back To Anime</strong>
          </Link>
          <Link to="/dashboard" className="navbar-brand ml-auto">
            <img src={bigLogo} alt="Big Logo" className="logo img-fluid mr-3" style={{ minHeight: '50px', maxHeight: '50px' }} />
          </Link>
          <div className="ml-auto">
            <button onClick={handleLogOut} className="btn btn-danger">
              <strong>Log Out</strong>
            </button>
          </div>
        </div>
      </TopNavbar>
      <div className="p-4 text-white" style={{ background: "linear-gradient(to bottom, #2e77AE, #000000)" }}>
        <div className="container">
          <div className="row justify-content-center">
          <div className="col-md-6 d-flex align-items-center justify-content-center">
            <div className="anime-details-box mb-4">
              {animeData ? (
                <div className="anime-info d-flex justify-content-center">
                  <img src={animeData.images.jpg.image_url} alt="anime pic" className="img-fluid" />
                </div>
              ) : (
                <p>No Data Available</p>
              )}
              <button id='favorite-button' onClick={toggleFavorite} className="d-flex align-items-center m-5 ml-2 text-center btn btn-secondary">
                {showHeart ? (
                  <BsHeart className="p-1" style={{ fontSize: '25px' }} />
                  
                ) : (
                  <BsHeartFill className="p-1" style={{ color: 'red', fontSize: '25px' }} />
                )}
                <p className='mb-0 ml-2'>{buttonText}</p>
              </button>
            </div>
          </div>

            <div className="col-md-6">
              <div className="anime-synopsis-box border p-4 mb-4" style={{ backgroundColor: "#111920" }}>
                {animeData && (
                  <>
                    <h1>{animeData.title_english}</h1>
                    <div className="synopsis-content">
                      <p className="anime-synopsis">{animeData.synopsis}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="more-info-box border border-white p-3 mb-4 text-white" style={{ backgroundColor: "#111920", minHeight: '376px', maxHeight: '376px' }}>
                <h2 className='p-3 m-2'>More About This Show:</h2>
                <p className='m-2 p-3 fs-5'>Episode Count: {animeData && animeData.episodes !== null ? animeData.episodes : 0}</p>
                <p className='m-2 p-3 fs-5'>Rating: {animeData && animeData.rating}</p>
                <a href={animeData.trailer.url} target="_blank" rel="noopener noreferrer" className='m-3 text-center fs-5 btn btn-danger'>
                  Watch a Trailer Here!
                </a>
                </div>
            </div>
            <div className="col-md-6">
              <div className="score-box container-fluid border p-4 mb-4" style={{ backgroundColor: "#111920" }}>
                {animeData && (
                  <>
                    <h2 className='fs-2 text-center'>Overall Score</h2>
                    <p className="big-score text-center">{animeData.score} / 10</p>
                    <div className="stuff text-center">
                      {animeData.score >= 8.0 ? (
                        <>
                          <img src={highScoreImage} alt="High Score" style={{ width: '200px', height: '200px' }} />
                          <p>Top Pick!</p>
                        </>
                      ) : animeData.score >= 4.0 ? (
                        <>
                          <img src={mediumScoreImage} alt="Medium Score" style={{ width: '200px', height: '200px' }} />
                          <p>Good Pick!</p>
                        </>
                      ) : (
                        <>
                          <img src={lowScoreImage} alt="Low Score" style={{ width: '200px', height: '200px' }} />
                          <p>Not Recommended/Unrated</p>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-md-12">
              <div className="recommendations-container border border-white p-3 mb-4" style={{backgroundColor: "#111920"}}>
                {recommendations && recommendations.length > 0 && (
                  <h2>You Might Also Like:</h2>
                )}
                <div className="recommendations-list d-flex justify-content-center">
                  {recommendations && recommendations.length > 0 ? (
                    recommendations.map((recommendation) => (
                      <div key={recommendation.entry.mal_id} className="recommendation-item p-4">
                        <Link className="text-decoration-none" to={`/anime/${recommendation.entry.mal_id}`}>
                          <div style={{ maxWidth: "225px" }}>
                            <img src={recommendation.entry.images.jpg.image_url} alt={recommendation.entry.title} className="recommendation-image align-content-center" style={{maxHeight: '300px'}} />
                            <h3 className='text-white text-truncate'>{recommendation.entry.title}</h3>
                          </div>
                        </Link>
                      </div>
                    ))
                  ) : (
                    <h2>No recommendations available Yet</h2>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimePage;
