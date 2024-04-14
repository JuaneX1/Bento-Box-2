import React, { useState } from 'react';
import '../../css/AnimeCard.css';

function AnimeCard({ anime }) {
  const [showSynopsis, setShowSynopsis] = useState(false);

  const handleMouseEnter = () => {
    setShowSynopsis(true);
  };

  const handleMouseLeave = () => {
    setShowSynopsis(false);
  };

  const truncateSynopsis = (synopsis, maxLength) => {
    if (synopsis.length <= maxLength) {
      return synopsis;
    }
    return synopsis.substring(0, maxLength) + '...';
  };

  return (
    <article className="anime-card" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
    <a
        href={anime.url}
        target="_blank"
        rel="norefererr"
      >
        <figure>
          <img src={anime.images.jpg.image_url} alt="AnimeImage" />
        </figure>
        <h3>{anime.title}</h3>

      {showSynopsis && (
        <div className="synopsis-overlay">
          <p>{truncateSynopsis(anime.synopsis, 150)}</p>
        </div>
      )}
    </a>
    </article>
  );
}

export default AnimeCard;
