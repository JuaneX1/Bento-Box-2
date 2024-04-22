import React from 'react';

const AnimeList = ({ animelist }) => {
  return (
    <div className="row row-cols-1 row-cols-md-3 anime-list">
      {animelist ? (
        animelist.map((anime, index) => (
          <div className="col mb-3" key={index}>
            <div className="card h-100 overflow-hidden border border-dark">
              <img
                src={anime.images.jpg.large_image_url}
                className="card-img-top w-100 h-100"
                style={{ objectFit: 'cover' }} // Ensure the image covers the entire container and cuts out white space if image is smaller
                alt="animeImage"
              />
            </div>
          </div>
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default AnimeList;
