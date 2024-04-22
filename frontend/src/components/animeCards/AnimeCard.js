import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function AnimeCard({ anime }) {
  const [showSynopsis, setShowSynopsis] = useState(false);

  const handleMouseEnter = () => {
    setShowSynopsis(true);
  };

  const handleMouseLeave = () => {
    setShowSynopsis(false);
  };

  const handleBlur = () => {
    setShowSynopsis(false);
  };

  const truncateSynopsis = (synopsis) => {
    if (!synopsis || synopsis.length <= 150) {
      return synopsis;
    }
    return synopsis.substring(0, 150) + '...';
  };

  return (
    <div className="card anime-card card overflow-hidden border border-dark" style={{ objectFit: "cover", minWidth: '250px', maxWidth: '250px'}}>
      <div
        className="card-img-wrapper"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleBlur}
      >
        <Link
          to={`/anime/${anime.mal_id}`}
          state={{ anime }}
          className="text-decoration-none text-dark"
        >
          <img src={anime.images.jpg.image_url} className="card-img-top" alt="AnimeImage" />
          <div className="title-overlay position-absolute start-0 bottom-0 w-100 p-2 bg-black text-white">
            <h5 className="card-title text-white text-center mb-0" style={{ fontSize: '14px' }}>{anime.title_english}</h5>
          </div>
        </Link>
        {showSynopsis && (
          <div className="synopsis-overlay position-absolute start-0 top-0 w-100 h-100 bg-black opacity-75 d-flex flex-column justify-content-center align-items-center">
            <p className="card-text text-white text-center p-2">{truncateSynopsis(anime.synopsis)}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AnimeCard;
