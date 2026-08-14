import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../Stylesheet.css';

function AnimeCard({ anime }) {
  const [isOpen, setIsOpen] = useState(false);

  const truncateSynopsis = (synopsis) => {
    if (!synopsis || synopsis.length <= 150) {
      return synopsis;
    }
    return synopsis.substring(0, 150) + '...';
  };

  // Touch devices have no hover, so a tap opens the lid instead of navigating immediately
  const handleTap = (e) => {
    if (!isOpen) {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  return (
    <div
      className={`anime-card ${isOpen ? 'is-open' : ''}`}
      onMouseLeave={() => setIsOpen(false)}
      onBlur={() => setIsOpen(false)}
    >
      <img src={anime.images.jpg.image_url} className="card-img-top" alt="AnimeImage" />

      <Link
        to={`/anime/${anime.id}`}
        state={{ anime }}
        className="text-decoration-none"
        onClick={handleTap}
        tabIndex={0}
      >
        <div className="card-synopsis">
          <p>{truncateSynopsis(anime.synopsis)}</p>
        </div>
      </Link>

      <div className="card-lid">
        <h5 className="card-title">{anime.title_english}</h5>
      </div>
    </div>
  );
}

export default AnimeCard;
