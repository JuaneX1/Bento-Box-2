import React, { useEffect, useState } from 'react';
import bigLogo from '../../assets/BB_Logo_Horizontal_COLOR_1.png';
import highScoreImage from '../../assets/highScoreImg.webp';
import lowScoreImage from '../../assets/lowScoreImg.png';
import mediumScoreImage from '../../assets/mediumScoreImg.png';
import { instance } from '../../App';

const Favorites = () => {
const [animeData, setAnimeData] = useState(null);
const [loading, setLoading] = useState(true);
let ignore = false;

useEffect(() => {
	async function fetchFavorites() {
		if (!ignore) {
			try {
				const favoritesArr = await instance.get(`/getFavorite`, { headers: { Authorization: sessionStorage.getItem('token') } });

				console.log(favoritesArr.data);

				const animeDetails = await Promise.all(
				favoritesArr.data.map(async favorite => {
					const response = await instance.get(`https://api.jikan.moe/v4/anime/${favorite}`);
					return response.data.data;
				}));

				setAnimeData(animeDetails);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching favorites:", error);
			}
		}
	}

	fetchFavorites();

	return () => {
	ignore = true;
	};
}, []);

  return (
    <div>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        animeData.map(anime => (
          <div className="anime-info" key={anime.mal_id}>
            <img src={anime.images.jpg.image_url} alt={"anime pic"} />
            <div className="anime-synopsis-box">
              <h1>{anime.title_english}</h1>
              <div className="synopsis-content">
                <p className="anime-synopsis">{anime.synopsis}</p>
              </div>
            </div>

            <div className="score-box">
              <h2>Overall Rating</h2>
              <h3>{anime.score} / 10</h3>
              {anime.score >= 7.0 ? (
                <div className="stuff">
                  <img src={highScoreImage} alt="1" />
                  <h3>Top Pick!</h3>
                </div>
              ) : anime.score >= 4.0 ? (
                <img src={mediumScoreImage} alt="2" />
              ) : (
                <img src={lowScoreImage} alt="3" />
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Favorites;
