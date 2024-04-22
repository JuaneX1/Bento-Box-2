import React, { useEffect, useState } from 'react';
import { instance } from '../../App';
import { BsHeart, BsHeartFill } from 'react-icons/bs';

const DailyBox = () => {
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

            if (!favorites.find(favorite => favorite.mal_id === malId)) {
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

 

  return (
    <div>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <div className="anime-info" key={recommendedAnime.mal_id}>
          <img src={recommendedAnime.images.jpg.image_url} alt={"anime pic"} />
          <div className="anime-synopsis-box">
            <h1>{recommendedAnime.title}</h1>
            <div className="synopsis-content">
              <p className="anime-synopsis">Insert synopsis here</p>
            </div>
          </div>

          <div className="score-box">
            <h2>Overall Rating</h2>
            <h3>Insert score here / 10</h3>
            {/* Update images based on score */}
          </div>
          <button onClick={() => toggleFavorite(recommendedAnime.mal_id)}>
            {showHeart ? (
              <BsHeart className="p-1" style={{ fontSize: '25px' }} />
            ) : (
              <BsHeartFill className="p-1" style={{ color: 'red', fontSize: '25px' }} />
            )}
            <p className='mb-0 ml-2'>{buttonText}</p>
          </button>
        </div>
      )}
    </div>
  );
};

export default DailyBox;
