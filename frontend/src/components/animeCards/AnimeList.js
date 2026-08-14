import React from 'react';
import { Link } from 'react-router-dom';

const AnimeList = ({ animelist }) => {
  if (!animelist) {
    return <p className="text-center" style={{ color: 'var(--cheek-dim)' }}>Loading...</p>;
  }

  return (
    <div className="row row-cols-3 g-2">
      {animelist.map((anime, index) => (
        <div className="col" key={index}>
          <Link to={`/anime/${anime.id}`} state={{ anime }} className="marquee-thumb d-block text-decoration-none">
            <img
              src={anime.images.jpg.large_image_url}
              className="w-100 h-100"
              style={{ objectFit: 'cover' }}
              alt={anime.title_english || 'anime cover'}
            />
            <span className="marquee-thumb-title">{anime.title_english}</span>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default AnimeList;
