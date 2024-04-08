import React, { useState, useEffect } from 'react';
import AnimeCard from '../components/animeCards/AnimeCard';
import '../css/Browse.css';

const Browse = () => {
    const [categories, setCategories] = useState([]);
    const [animeByCategory, setAnimeByCategory] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const categoriesToFetch = [
            { name: 'top rated', endpoint: 'https://api.jikan.moe/v4/top/anime' },
            { name: 'upcoming', endpoint: 'https://api.jikan.moe/v4/seasons/upcoming' },
            { name: 'currently airing', endpoint: 'https://api.jikan.moe/v4/seasons/now' },
        ];

        setCategories(categoriesToFetch.map(category => category.name));

        Promise.all(categoriesToFetch.map(category =>
            fetch(category.endpoint)
            .then(response => response.json())
            .then(data => ({ name: category.name, data: data.data }))
        ))
        .then(results => {
            const newAnimeByCategory = results.reduce((acc, { name, data }) => {
                acc[name] = data;
                return acc;
            }, {});
            setAnimeByCategory(newAnimeByCategory);
        })
        .catch(error => console.log(error))
        .finally(() => setIsLoading(false));
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="browse">
            {categories.map(category => (
                <div key={category} className="category">
                    <h2 className="category-title">{category.toUpperCase()}</h2>
                    <div className="anime-list">
                        {animeByCategory[category]?.map(anime => (
                            <AnimeCard key={anime.mal_id} anime={anime} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Browse;
