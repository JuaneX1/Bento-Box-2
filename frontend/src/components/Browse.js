import React, { useEffect, useState } from 'react';
import BrowseContent from './pageFeatures/BrowseContent';

const Browse = () => {
    const [selectedCategory, setSelectedCategory] = useState('top rated');
    const [animeList, setAnimeList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isFetching, setIsFetching] = useState(false); // Add isFetching state
    let ignore = false;
    let ignoreScroll = false;

    const categories = [
        { name: 'top rated', endpoint: 'https://api.jikan.moe/v4/top/anime?limit=24' },
        { name: 'upcoming', endpoint: 'https://api.jikan.moe/v4/seasons/upcoming?limit=24' },
        { name: 'airing now', endpoint: 'https://api.jikan.moe/v4/seasons/now?limit=24' },
    ];

    const fetchAnimeByCategory = async (endpoint, page = 1) => {
        setIsLoading(true);
        setError('');
        try {
            const response = await fetch(`${endpoint}&page=${page}`);
            const data = await response.json();
            setIsLoading(false);
            return data.data;
        } catch (error) {
            console.error('Error fetching anime:', error);
            setError(`Error fetching data: ${error.message}`);
            setIsLoading(false);
            return [];
        }
    };

    useEffect(() => {

        async function fetchInitialData() {
            if (!ignore && animeList.length === 0) {
                console.log(animeList.length);
                const animes = categories.find(category => category.name === selectedCategory);
                if (animes) {
                    fetchAnimeByCategory(animes.endpoint, 1).then(initialData => {
                        setAnimeList(initialData);
                    });
                }
            }
        }

        fetchInitialData();

        return () => { ignore = true; }
    }, [selectedCategory]);


    useEffect(() => {

        const handleScroll = () => {

            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
            const clientHeight = document.documentElement.clientHeight || window.innerHeight;
            const threshold = 100;

            console.log(!ignoreScroll);

            if (!ignoreScroll && scrollTop + clientHeight + threshold >= scrollHeight) {
                setCurrentPage(prevPage => prevPage + 1);
                ignoreScroll = true;
            } else {
                ignoreScroll = false;
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };

    }, []);

    useEffect(() => {

        if (!ignore && currentPage !== 1) fetchMoreAnime();

        return () => { ignore = true; };
    }, [currentPage]);

    const fetchMoreAnime = async () => {
        setIsFetching(true); // Set isFetching to true to prevent multiple fetch requests
        const category = categories.find(cat => cat.name === selectedCategory);
        if (category) {
            const nextPage = currentPage;
            fetchAnimeByCategory(category.endpoint, nextPage) 
                .then(newData => {
                    setAnimeList(prevList => [...prevList, ...newData]);
                })
                .catch(error => {
                    console.error('Error fetching more anime:', error);
                    setError(`Error fetching more data: ${error.message}`);
                    setIsLoading(false);
                });
        } else {
            console.error('Selected category not found:', selectedCategory);
            setIsLoading(false);
        }
        setIsFetching(false);
    };

    const handleCategoryChange = (categoryName, endpoint) => {
        setSelectedCategory(categoryName);
        setAnimeList([]); // Clear anime list
        setCurrentPage(1); // Reset page count
        ignore = false;
    };

    return (
        <div>
            <div className="row justify-content-center">
                <div className="category-buttons d-flex justify-content-center">
                    {categories?.map(category => (
                        <button
                            className="btn btn-outline-light text-center category-btn m-4"
                            key={category.name}
                            onClick={() => handleCategoryChange(category.name, category.endpoint)}
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

