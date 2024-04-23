import React, { useEffect, useState } from 'react';
import { instance } from '../../App';
import { BsHeart, BsHeartFill } from 'react-icons/bs';
import { Container } from 'react-bootstrap';

const RecommendationPage = () => {
  const [recommendedAnime, setRecommendedAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [showHeart, setShowHeart] = useState(true);
  const [buttonText, setButtonText] = useState('');

  const toggleFavorite = async (id) => {
    try {
      const response = await instance.post(`/setFavorite/`, { mal_id: id }, { headers: { Authorization: sessionStorage.getItem('token') } });
      const message = response.data.message;

      if (message === "Removing Favorite") {
        setButtonText('Favorite');
        setShowHeart(true);
      } else if (message === "Adding Favorite") {
        setButtonText('Unfavorite');
        setShowHeart(false);
      }

      console.log(message);
      console.log(buttonText);

    } catch (error) {
      console.log(error);
    }
  };

  let ignore = false;

  useEffect(() => {
    let isMounted = true;

    async function fetchFavorites() {
      if (!isMounted) return;

      try {
        const favoritesArr = await instance.get(`/getFavorite`, { headers: { Authorization: sessionStorage.getItem('token') } });
        setFavorites(favoritesArr.data);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    }

    fetchFavorites();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    async function fetchRecommendation() {
      if (favorites.length === 0 || ignore) return;

      try {
        let recommendedAnimeId = null;

        while (!recommendedAnimeId) {
          const randomIndex = Math.floor(Math.random() * favorites.length);
          recommendedAnimeId = favorites[randomIndex];

          const response = await instance.get(`https://api.jikan.moe/v4/anime/${recommendedAnimeId}/recommendations`);
          const data = response.data;
          const animeRecommendationsList = data.data;

          for (let anime of animeRecommendationsList) {
            const malId = anime.entry.mal_id;

            if (!favorites.includes(malId.toString())) {
              setRecommendedAnime(anime.entry);
              setLoading(false);
              return;
            }
          }
        }
      } catch (error) {
        console.error("Error fetching recommendation:", error);
      }
    }

    fetchRecommendation();

    return () => {
      ignore = true;
    };
  }, [favorites]);

  const navigateToAnimePage = () => {
    window.location.href = `/anime/${recommendedAnime.mal_id}`;
  };

  return (
    <div>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <div>
          <Container className='p-5'>
            <div className="container text-white p-4 " style={{ border: '2px solid #ffffff', backgroundColor: '#111920', maxWidth: '800px' }}>
              <div className="row justify-content-center">
                <div className="col-md-8 p-4 text-center">
                  <h2 className="mb-4">{recommendedAnime.title}</h2>
                  <img src={recommendedAnime.images.jpg.image_url} alt={"anime pic"} className="img-fluid mb-4" />
                  <div className="anime-synopsis-box">
                    <div className="synopsis-content">
                    </div>
                    <button className="btn btn-primary mt-4" onClick={navigateToAnimePage}>
                      More Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </div>
      )}
    </div>
  );
};

export default RecommendationPage;
