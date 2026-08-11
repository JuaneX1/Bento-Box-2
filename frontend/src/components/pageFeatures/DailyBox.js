import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import fetchJikan from '../../utils/fetchJikan';

const DailyBox = () => {
  const [pool, setPool] = useState([]);
  const [recommendedAnime, setRecommendedAnime] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPool() {
      try {
        const randomPage = Math.floor(Math.random() * 10) + 1;
        const data = await fetchJikan(`https://api.jikan.moe/v4/top/anime?limit=24&page=${randomPage}`);
        setPool(data.data || []);
      } catch (error) {
        console.error('Error fetching daily box pool:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPool();
  }, []);

  useEffect(() => {
    if (pool.length > 0) {
      const randomIndex = Math.floor(Math.random() * pool.length);
      setRecommendedAnime(pool[randomIndex]);
    }
  }, [pool]);

  const shuffle = () => {
    if (pool.length === 0) return;
    const randomIndex = Math.floor(Math.random() * pool.length);
    setRecommendedAnime(pool[randomIndex]);
  };

  const navigateToAnimePage = () => {
    window.location.href = `/anime/${recommendedAnime.mal_id}`;
  };

  return (
    <div>
      {loading || !recommendedAnime ? (
        <h1 className='text-white text-center p-4'>Loading a recommendation...</h1>
      ) : (
        <div>
          <Container className='p-5'>
            <div className="container text-white p-4 " style={{ border: '2px solid #ffffff', backgroundColor: '#111920', maxWidth: '800px' }}>
              <div className="row justify-content-center">
                <div className="col-md-8 p-4 text-center">
                  <h2 className="mb-4">{recommendedAnime.title}</h2>
                  <img src={recommendedAnime.images.jpg.image_url} alt={"anime pic"} className="img-fluid mb-4" />
                  <div className="anime-synopsis-box d-flex justify-content-center">
                    <button className="btn btn-secondary mt-4 me-2" onClick={shuffle}>
                      Shuffle
                    </button>
                    <button className="btn btn-primary mt-4" onClick={navigateToAnimePage}>
                      More Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </div>
      )}
    </div>
  );
};

export default DailyBox;
