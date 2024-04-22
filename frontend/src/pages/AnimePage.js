import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { instance } from '../App';
import bigLogo from '../assets/BB_Logo_Horizontal_COLOR_1.png';
import highScoreImage from '../assets/highScoreImg.webp';
import lowScoreImage from '../assets/lowScoreImg.png';
import mediumScoreImage from '../assets/mediumScoreImg.png';
import '../css/AnimePage.css';
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
        const response = await instance.get(`https://api.jikan.moe/v4/anime/${id}`);
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
        const response = await instance.get(`https://api.jikan.moe/v4/anime/${id}/recommendations`);
        const data = response.data;
        const animeRecommendationsList = data.data.slice(0, 3);

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
  
	const toggleFavorite = async () => {
		try {
			await instance.post(`/setFavorite/`, { mal_id: id }, { headers: { Authorization: sessionStorage.getItem('token') }});
		} catch (error) {
			console.log(error);
		}
	};

  return (
    <div className="anime-container">
      <div className="topbar">
        <Link to="/profile" className="topbar-btn">My Profile</Link>
        <Link to="/dashboard"><img src={bigLogo} alt="Logo" className="topbar-logo" /></Link>
        <button onClick={handleLogOut} className="log-out-btn">Log Out</button>
      </div>
      {animeData ? (
        <div className="anime-info">
          <img src={animeData.images.jpg.image_url} alt={"anime pic"} />
          <div className="anime-synopsis-box">
            <h1>{animeData.title_english}</h1>
            <div className="synopsis-content">
              <p className="anime-synopsis">{animeData.synopsis}</p>
            </div>
          </div>
          <div className="score-box">
            <h2>Overall Score</h2>
            <h3 className="big-score">{animeData.score} / 10</h3>
              {animeData.score >= 8.0 ? (
                <div className="stuff">
                  <img src={highScoreImage} alt="High Score" />
                  <h3>Top Pick!</h3>
                </div>
              ) : animeData.score >= 4.0 ? (
                <div className="stuff">
                  <img src={mediumScoreImage} alt="Medium Score" />
                  <h3>Good Pick!</h3>
                </div>    
              ) : (
                <div className="stuff">
                  <img src={lowScoreImage} alt="Low Score" />
                  <h3>Not Recommended/Unrated</h3>
                </div>
              )}
          </div>
        </div>
      ) : (
        <h1>No Data Available</h1>
      )}
      <div className="bottom-container">
      <button id="favorite-btn" onClick={toggleFavorite}>Favorite</button>
        <div className="more-info-box">
          <h1>More About This Show</h1>
          <h3>Episode Count: {animeData.episodes !== null ? animeData.episodes : 0}</h3>
          <br />
          <h3><a href={animeData.trailer.url}>Watch a Trailer Here!</a></h3>
          <br />
          <h3>Rating: {animeData.rating}</h3>
          <button id="favorite-button" onClick={toggleFavorite}>Favorite</button>
        </div>
        <div className="recommendations-container">
          {recommendations && recommendations.length > 0 && (
          <h2>You Might Also Like:</h2>
        )}
        <div className="recommendations-list">
          {recommendations && recommendations.length > 0 ? (
            recommendations.map((recommendation) => (
              <div key={recommendation.entry.mal_id} className="recommendation-item">
                <Link to={`/anime/${recommendation.entry.mal_id}`}>
                  <img src={recommendation.entry.images.jpg.image_url} alt={recommendation.entry.title} className="recommendation-image" />
                  <h4>{recommendation.entry.title}</h4>
                </Link>
              </div>
            ))
          ) : (
            <h2>No recommendations available Yet</h2>
          )}
        </div>
      </div>`


      </div>
    </div>
  );
  
  
};

export default AnimePage;
