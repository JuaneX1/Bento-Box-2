import React, { useEffect, useState } from 'react';
import BrowseContent from './pageFeatures/BrowseContent'

const Browse = () => {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [animeList, setAnimeList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const categories = [
        { name: 'top rated', endpoint: 'https://api.jikan.moe/v4/top/anime' },
        { name: 'upcoming', endpoint: 'https://api.jikan.moe/v4/seasons/upcoming' },
        { name: 'airing now', endpoint: 'https://api.jikan.moe/v4/seasons/now' },
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
        
        <div>
            <div className="row justify-content-center">
                    <div className="category-buttons d-flex justify-content-center">
                        {categories?.map(category => (
                            <button
                                className="btn btn-outline-light text-center category-btn m-4"
                                key={category.name}
                                onClick={() => fetchAnimeByCategory(category.endpoint, category.name)}
                            >
                                {category.name.toUpperCase()}
                            </button>
                        ))}
            </div>
                    <div className="">
                        {isLoading && <div className='text-white'>Loading...</div>}
                        {error && <div>Error: {error}</div>}
                        {!isLoading && !error && ( 
                            <div>
                                <h2 className="category-title text-white text-center p-4"><strong>{selectedCategory.toUpperCase()}</strong></h2>
                                
                                <BrowseContent
                                    animeList={animeList}
                                />
                                
                            </div>
                        )}
                    </div>
                </div>
            </div>
        
    );
};

export default Browse;
