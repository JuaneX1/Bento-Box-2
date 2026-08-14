import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import bigLogo from '../assets/BB_Logo_Horizontal_COLOR_1.png';
import highScoreImage from '../assets/highScoreImg.webp';
import lowScoreImage from '../assets/lowScoreImg.png';
import mediumScoreImage from '../assets/mediumScoreImg.png';
import '../components/Stylesheet.css';
import { fetchAnimeById, fetchAnimeRecommendations } from '../utils/fetchAniList';

// Ticks a displayed number up from 0 to the target score over a short duration
const useCountUp = (target, durationMs = 700) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!target) return;
    if (typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target);
      return;
    }

    const startTime = performance.now();
    let frame;

    const tick = (now) => {
      const progress = Math.min((now - startTime) / durationMs, 1);
      setValue(Number((target * progress).toFixed(1)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, durationMs]);

  return value;
};

const AnimePage = () => {
  const { id } = useParams();
  const [animeData, setAnimeData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const displayedScore = useCountUp(animeData?.score);

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      try {
        const data = await fetchAnimeById(id);
        setAnimeData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching anime details:', error);
        setLoading(false);
      }
    };

    const loadAnimeRecommendations = async () => {
      try {
        const data = await fetchAnimeRecommendations(id, 3);
        setRecommendations(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching anime recommendations:', error);
        setLoading(false);
      }
    };

    fetchAnimeDetails();
    loadAnimeRecommendations();
  }, [id]);

  if (loading || !animeData) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', backgroundColor: 'var(--void)' }}>
        <div className="compartment-skeleton" style={{ width: '280px', aspectRatio: '2 / 3' }} />
      </div>
    );
  }

  const scoreTier = animeData.score >= 8.0
    ? { image: highScoreImage, label: 'Top Pick!' }
    : animeData.score >= 4.0
      ? { image: mediumScoreImage, label: 'Good Pick!' }
      : { image: lowScoreImage, label: 'Not Recommended/Unrated' };

  return (
    <div style={{ backgroundColor: 'var(--void)', minHeight: '100vh' }}>
      <nav className="navbar navbar-expand-lg navbar-dark d-flex justify-content-between p-2" style={{ backgroundColor: 'var(--ink)', borderBottom: '1px solid var(--blue-shade)' }}>
        <div className="container-fluid">
          <Link to="/dashboard" className="btn-bento-outline px-3 py-2 text-decoration-none">
            Back to Anime
          </Link>
          <Link to="/dashboard" className="navbar-brand ml-auto">
            <img src={bigLogo} alt="Big Logo" className="logo img-fluid mr-3" style={{ minHeight: '50px', maxHeight: '50px' }} />
          </Link>
        </div>
      </nav>
      <div className="container p-4">
        <div className="row justify-content-center">
          <div className="col-md-5 mb-4">
            <img src={animeData.images.jpg.image_url} alt={animeData.title_english} className="img-fluid w-100" style={{ border: '1px solid var(--blue-shade)' }} />
          </div>

          <div className="col-md-7 mb-4">
            <div className="tray p-4 h-100">
              {animeData.genres.length > 0 && (
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {animeData.genres.map((genre) => (
                    <span key={genre} className="tray-eyebrow" style={{ border: '1px solid var(--blue-shade)', padding: '0.2rem 0.6rem' }}>{genre}</span>
                  ))}
                </div>
              )}
              <h1 style={{ color: 'var(--cheek)' }}>{animeData.title_english}</h1>
              <p className="score-figure mb-3" style={{ color: 'var(--cheek-dim)', fontSize: '0.85rem' }}>
                {[animeData.format, animeData.studio, animeData.status?.replace(/_/g, ' ')].filter(Boolean).join(' · ')}
              </p>
              <p style={{ color: 'var(--cheek-dim)', lineHeight: 1.6 }}>{animeData.synopsis}</p>
              {animeData.trailer && animeData.trailer.url && (
                <a href={animeData.trailer.url} target="_blank" rel="noopener noreferrer" className="btn-bento-accent d-inline-block mt-2 px-4 py-2 text-decoration-none">
                  Watch a Trailer Here!
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-12 mb-4">
            <div className="tray d-flex flex-wrap">
              <div className="d-flex flex-column align-items-center justify-content-center text-center p-3" style={{ flex: '1 1 160px', borderRight: '1px solid var(--blue-shade)' }}>
                <img src={scoreTier.image} alt={scoreTier.label} style={{ width: '64px', height: '64px' }} />
                <p className="score-figure mb-0 mt-1" style={{ fontSize: '1.5rem', color: 'var(--blue-tint)' }}>
                  {displayedScore.toFixed(1)} <span style={{ fontSize: '0.9rem', color: 'var(--cheek-dim)' }}>/ 10</span>
                </p>
                <p className="tray-eyebrow mb-0">{scoreTier.label}</p>
              </div>
              <div className="d-flex flex-column align-items-center justify-content-center text-center p-3" style={{ flex: '1 1 160px', borderRight: '1px solid var(--blue-shade)' }}>
                <p className="score-figure mb-0" style={{ fontSize: '1.5rem', color: 'var(--cheek)' }}>{animeData.episodes ?? '—'}</p>
                <p className="tray-eyebrow mb-0">Episodes</p>
              </div>
              <div className="d-flex flex-column align-items-center justify-content-center text-center p-3" style={{ flex: '1 1 160px', borderRight: '1px solid var(--blue-shade)' }}>
                <p className="score-figure mb-0" style={{ fontSize: '1.5rem', color: 'var(--cheek)' }}>{animeData.duration ?? '—'}</p>
                <p className="tray-eyebrow mb-0">Min / Episode</p>
              </div>
              <div className="d-flex flex-column align-items-center justify-content-center text-center p-3" style={{ flex: '1 1 160px' }}>
                <p className="score-figure mb-0" style={{ fontSize: '1.5rem', color: 'var(--cheek)' }}>{animeData.format ?? '—'}</p>
                <p className="tray-eyebrow mb-0">Format</p>
              </div>
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-12 mb-4">
            <div className="tray p-4">
              {recommendations && recommendations.length > 0 && (
                <h2 style={{ color: 'var(--cheek)' }}>You Might Also Like</h2>
              )}
              <div className="d-flex flex-wrap justify-content-center gap-4 pt-2">
                {recommendations && recommendations.length > 0 ? (
                  recommendations.map((recommendation) => (
                    <Link
                      key={recommendation.entry.id}
                      className="text-decoration-none"
                      to={`/anime/${recommendation.entry.id}`}
                      style={{ maxWidth: '200px' }}
                    >
                      <img src={recommendation.entry.images.jpg.image_url} alt={recommendation.entry.title} className="img-fluid mb-2" style={{ border: '1px solid var(--blue-shade)' }} />
                      <h3 className="text-truncate" style={{ color: 'var(--cheek)', fontSize: '1rem' }}>{recommendation.entry.title}</h3>
                    </Link>
                  ))
                ) : (
                  <p style={{ color: 'var(--cheek-dim)' }}>No recommendations available yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimePage;
