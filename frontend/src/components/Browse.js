import React, { useEffect, useState } from 'react';
import BrowseContent from './pageFeatures/BrowseContent'
import styled from 'styled-components';

const Browse = () => {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [animeList, setAnimeList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const categories = [
        { name: 'top rated', endpoint: 'https://api.jikan.moe/v4/top/anime?limit=24' },
        { name: 'upcoming', endpoint: 'https://api.jikan.moe/v4/seasons/upcoming?limit=24' },
        { name: 'airing now', endpoint: 'https://api.jikan.moe/v4/seasons/now?limit=24' },
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

    const CustomPrimaryButton = styled.button`
        background-color: #111920;
        border: none;
        transition: all 0.3s ease;

        &:hover,
        &:focus {
        background-color: #111920;
        color: white;
        border: 2px solid white;
        transform: scale(1.05);
        }
    `;

    return (
        
        <div>
            <div className="row justify-content-center">
                    <div className="category-buttons d-flex justify-content-center">
                        {categories?.map(category => (
                            <CustomPrimaryButton
                                className="btn btn-outline-light text-center category-btn m-4"
                                key={category.name}
                                onClick={() => fetchAnimeByCategory(category.endpoint, category.name)}
                            >
                                {category.name.toUpperCase()}
                            </CustomPrimaryButton>
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
