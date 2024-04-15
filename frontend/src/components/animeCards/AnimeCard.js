import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../css/AnimeCard.css';

function AnimeCard({ anime }) {
  const [showSynopsis, setShowSynopsis] = useState(false);

  const handleMouseEnter = () => {
    setShowSynopsis(true);
  };

  const handleMouseLeave = () => {
    setShowSynopsis(false);
  };

  const truncateSynopsis = (synopsis) => {
    if (!synopsis || synopsis.length <= 150) {
      return synopsis;
    }
    return synopsis.substring(0, 150) + '...';
  };
  
  
  return (
    <article className="anime-card" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Link to={`/anime/${anime.mal_id}`} state={{ anime }}>
        <figure>
          <img src={anime.images.jpg.image_url} alt="AnimeImage" />
        </figure>
        <h3>{anime.title}</h3>

        {showSynopsis && (
          <div className="synopsis-overlay">
            <p>{truncateSynopsis(anime.synopsis)}</p>
          </div>
        )}
      </Link>
    </article>
  );
}

export default AnimeCard;
