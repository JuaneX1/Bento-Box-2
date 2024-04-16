import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import bigLogo from '../../assets/BB_Logo_Horizontal_COLOR_1.png';
import highScoreImage from '../../assets/highScoreImg.webp';
import lowScoreImage from '../../assets/lowScoreImg.png';
import mediumScoreImage from '../../assets/mediumScoreImg.png';
import '../../css/AnimePage.css';

const AnimePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [animeData, setAnimeData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Function to fetch anime details
    const fetchAnimeDetails = async () => {
      try {
        const response = await axios.get(`https://api.jikan.moe/v4/anime/${id}`);
        const data = response.data;
        const anime = data.data;
        setAnimeData(anime);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching anime details:', error);
        setLoading(false);
      }
    };

    // Function to fetch anime recommendations
    const fetchAnimeRecommendations = async () => {
      try 
      {
        const response = await axios.get(`https://api.jikan.moe/v4/anime/${id}/recommendations`);
        const data = response.data;
        const animeRecommendationsList = data.data.slice(0, 3);
        console.log("Anime Recommendation List:");
        console.log(animeRecommendationsList.slice(0, 3));

        setRecommendations(animeRecommendationsList);
        setLoading(false);
      }
      catch (error)
      {
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

  return (
    <div className="anime-container">
      <div className="topbar">
        <Link to="/profile" className="topbar-btn">My Profile</Link>
        <Link to="/dashboard"><img src={bigLogo} alt="Logo" className="topbar-logo" /></ Link>
            <button onClick={handleLogOut} className="log-out-btn">Log Out</button>
      </div>
      {animeData ? (
        <>
          <div className="anime-info">
            <img src={animeData.images.jpg.image_url} alt={animeData.title} className="anime-image" />
            <div className="anime-synopsis-box">
            <h1>{animeData.title}</h1>
              <p className="anime-synopsis">{animeData.synopsis}</p>
            </div>
            <div className="score-box">
              <h4>{animeData.score}</h4>
              {animeData.score >= 7.0 ? (
                <img src={highScoreImage} alt="High Score Image" />
              ) : animeData.score >= 4.0 ? (
                <img src={mediumScoreImage} alt="Medium Score Image" />
              ) : (
                <img src={lowScoreImage} alt="Low Score Image" />
              )}
            </div>
          </div>
        </>
      ) : (
        <h1>No Data Available</h1>
      )}
  
      {recommendations.length > 0 && (
        <div className="recommendations-container">
          <h2>You Might Also Like:</h2>
          <div className="recommendations-list">
            {recommendations.map((recommendation) => (
              <div key={recommendation.mal_id} className="recommendation-item">
                <Link to={`/anime/${recommendation.entry.mal_id}`}>
                  <img src={recommendation.entry.images.jpg.image_url} alt={recommendation.entry.title} className="recommendation-image" />
                  <h4>{recommendation.entry.title}</h4>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
  
};

export default AnimePage;
