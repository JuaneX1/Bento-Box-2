import React from 'react';
import AnimeCard from './AnimeCard'
import '../../css/AnimeList.css';

const AnimeList = ({ animelist, setAnimeInfo }) => {
  return (
    <div className="anime-list">
      {animelist ? (
        animelist.map((anime, index) => (
          <div className="card" key={index} >
            <img src={anime.images.jpg.large_image_url} alt="animeImage" />
          </div>
        ))
      ) : (
        <p>loading...</p>
      )}
    </div>
  );
};

export default AnimeList;
