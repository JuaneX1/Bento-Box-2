import React from 'react';
import './css/AnimeList.css';

const AnimeList = ({ animelist, setAnimeInfo }) => {
  return (
    <div className="anime-list">
      {animelist ? (
        animelist.map((anime, index) => (
          <div className="card" key={index} onClick={() => setAnimeInfo(anime)}>
            <img src={anime.images.jpg.large_image_url} alt="animeImage" />
            <div className="anime-info">
              <div className="title">
                <h4>{anime.title}</h4>
              </div>
              <div className="synopsis">
                <p>{anime.synopsis.length > 150 ? anime.synopsis.substring(0, 150) + "..." : anime.synopsis}</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>Anime not found</p>
      )}
    </div>
  );
};

export default AnimeList;
