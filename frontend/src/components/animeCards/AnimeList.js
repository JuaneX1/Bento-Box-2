import React from 'react';
import AnimeCard from './AnimeCard'
import '../../css/AnimeList.css';

const AnimeList = ({ animelist, setAnimeInfo }) => {
  return (
    <div className="anime-list">
      {animelist ? (
        animelist.map((anime, index) => (
          <AnimeCard anime= {anime} key={index} setAnimeInfo={setAnimeInfo} />
        ))
      ) : (
        <p>loading...</p>
      )}
    </div>
  );
};

export default AnimeList;
