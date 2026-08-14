import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTopAnime } from '../../utils/fetchAniList';

const prefersReducedMotion = () =>
  typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const DailyBox = () => {
  const navigate = useNavigate();
  const [pool, setPool] = useState([]);
  const [recommendedAnime, setRecommendedAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isShuffling, setIsShuffling] = useState(false);

  useEffect(() => {
    async function fetchPool() {
      try {
        const randomPage = Math.floor(Math.random() * 10) + 1;
        const data = await fetchTopAnime(randomPage, 24);
        setPool(data || []);
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

  const pickRandom = () => pool[Math.floor(Math.random() * pool.length)];

  // Flicks through a few random picks before landing, so "Shuffle" reads as an action
  const shuffle = () => {
    if (pool.length === 0 || isShuffling) return;

    if (prefersReducedMotion()) {
      setRecommendedAnime(pickRandom());
      return;
    }

    setIsShuffling(true);
    let ticks = 0;
    const totalTicks = 4;
    const interval = setInterval(() => {
      setRecommendedAnime(pickRandom());
      ticks += 1;
      if (ticks >= totalTicks) {
        clearInterval(interval);
        setIsShuffling(false);
      }
    }, 130);
  };

  const navigateToAnimePage = () => {
    navigate(`/anime/${recommendedAnime.id}`);
  };

  return (
    <div>
      {loading || !recommendedAnime ? (
        <div className="compartment-grid d-flex justify-content-center p-5">
          <div className="compartment-skeleton" style={{ maxWidth: '320px', width: '100%', aspectRatio: '4 / 5' }} />
        </div>
      ) : (
        <div className="d-flex justify-content-center p-5">
          <div className="tray p-4" style={{ maxWidth: '520px', width: '100%' }}>
            <p className="tray-eyebrow text-center mb-1">Today's pick</p>
            <div className="text-center" style={{ opacity: isShuffling ? 0.5 : 1, transition: 'opacity 0.1s ease' }}>
              <h2 className="mb-4" style={{ color: 'var(--cheek)' }}>{recommendedAnime.title_english}</h2>
              <img src={recommendedAnime.images.jpg.image_url} alt="anime pic" className="img-fluid mb-4" style={{ maxHeight: '360px', border: '1px solid var(--blue-shade)' }} />
            </div>
            <div className="d-flex justify-content-center gap-2">
              <button className="btn-bento-outline px-4 py-2" onClick={shuffle} disabled={isShuffling}>
                Shuffle
              </button>
              <button className="btn-bento-primary px-4 py-2" onClick={navigateToAnimePage}>
                More Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyBox;
