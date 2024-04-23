import React, { useEffect, useState } from 'react';
import { instance } from '../../App';
import BrowseContent from './BrowseContent'; // Import the BrowseContent component

const Favorites = () => {
  const [animeData, setAnimeData] = useState([]);
  const [loading, setLoading] = useState(true);
  let ignore = false;

  useEffect(() => {
    async function fetchFavorites() {
      if (!ignore) {
        try {
          const favoritesArr = await instance.get(`/getFavorite`, { headers: { Authorization: sessionStorage.getItem('token') } });

          const animeDetails = await Promise.all(
            favoritesArr.data.map(async favorite => {
              const response = await instance.get(`https://api.jikan.moe/v4/anime/${favorite}`);
              return response.data.data;
            })
          );

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
        <h1 className='text-center text-white p-4'>No Anime Favorited Yet!</h1>
      ) : (
        <div>
        <h2 className='text-white text-center p-3'><strong>Your Favorites</strong></h2>
        <BrowseContent animeList={animeData} />
        </div>
      )}
    </div>
  );
};

export default Favorites;
