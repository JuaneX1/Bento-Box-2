import React, { useState, useEffect } from 'react';
import AnimeCard from '../components/animeCards/AnimeCard';
import '../css/Browse.css';

const Browse = () => {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [animeList, setAnimeList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const categories = [
        { name: 'top rated', endpoint: 'https://api.jikan.moe/v4/top/anime' },
        { name: 'upcoming', endpoint: 'https://api.jikan.moe/v4/seasons/upcoming' },
        { name: 'currently airing', endpoint: 'https://api.jikan.moe/v4/seasons/now' },
    ];

    const fetchAnimeByCategory = (endpoint, categoryName) => {
        setIsLoading(true);
        setError('');
        fetch(endpoint)
            .then(response => response.json())
            .then(data => {
                setAnimeList(data.data);
                setSelectedCategory(categoryName);
            })
            .catch(error => {
                console.error(`Error fetching ${categoryName}:`, error);
                setError(`Error fetching data: ${error.message}`);
                setAnimeList([]);
            })
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        const topRated = categories.find(category => category.name === 'top rated');
        if (topRated) {
            fetchAnimeByCategory(topRated.endpoint, topRated.name);
        }
    }, []);

    return (
        <div className="browse">
            <div className="category-buttons">
                {categories?.map(category => (
                    <button
                      className="category-btn"
                      key={category.name}
                      onClick={() => fetchAnimeByCategory(category.endpoint, category.name)}
                    >
                        {category.name.toUpperCase()}
                    </button>
                ))}
            </div>
            <div className="category-display">
                {isLoading && <div>Loading...</div>}
                {error && <div>Error: {error}</div>}
                {!isLoading && !error && (
                    <div>
                        <h2 className="category-title">{selectedCategory.toUpperCase()}</h2>
                        <div className="anime-list">
                            {animeList?.map(anime => (
                                <AnimeCard key={anime.mal_id} anime={anime} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Browse;
