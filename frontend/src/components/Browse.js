import React, { useEffect, useState } from 'react';
import BrowseContent from './pageFeatures/BrowseContent';
import { fetchTopAnime, fetchSeasonalAnime, getCurrentSeason, getUpcomingSeason } from '../utils/fetchAniList';

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
        { name: 'top rated', fetch: (page) => fetchTopAnime(page, 24) },
        {
            name: 'upcoming',
            fetch: (page) => {
                const { season, seasonYear } = getUpcomingSeason();
                return fetchSeasonalAnime(season, seasonYear, page, 24);
            },
        },
        {
            name: 'airing now',
            fetch: (page) => {
                const { season, seasonYear } = getCurrentSeason();
                return fetchSeasonalAnime(season, seasonYear, page, 24);
            },
        },
    ];

    const fetchAnimeByCategory = async (fetchFn, page = 1) => {
        setIsLoading(true);
        setError('');
        try {
            const data = await fetchFn(page);
            setIsLoading(false);
            return data;
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
                    fetchAnimeByCategory(animes.fetch, 1).then(initialData => {
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

            if (!ignoreScroll && !isFetching && scrollTop + clientHeight + threshold >= scrollHeight) {
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

    }, [isFetching]);

    useEffect(() => {

        if (!ignore && currentPage !== 1) fetchMoreAnime();

        return () => { ignore = true; };
    }, [currentPage]);

    const fetchMoreAnime = async () => {
        setIsFetching(true); // Set isFetching to true to prevent multiple fetch requests
        const category = categories.find(cat => cat.name === selectedCategory);
        if (category) {
            const nextPage = currentPage;
            try {
                const newData = await fetchAnimeByCategory(category.fetch, nextPage);
                setAnimeList(prevList => [...prevList, ...newData]);
            } catch (error) {
                console.error('Error fetching more anime:', error);
                setError(`Error fetching more data: ${error.message}`);
                setIsLoading(false);
            }
        } else {
            console.error('Selected category not found:', selectedCategory);
            setIsLoading(false);
        }
        setIsFetching(false);
    };

    const handleCategoryChange = (categoryName) => {
        setSelectedCategory(categoryName);
        setAnimeList([]); // Clear anime list
        setCurrentPage(1); // Reset page count
        ignore = false;
    };

    return (
        <div>
            <div className="d-flex justify-content-center py-4">
                <div className="tray-tabs">
                    {categories?.map(category => (
                        <button
                            className={`tray-tab ${selectedCategory === category.name ? 'is-active' : ''}`}
                            key={category.name}
                            onClick={() => handleCategoryChange(category.name)}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>
            <div>
                {isLoading && (
                    <div className="compartment-grid d-flex flex-wrap justify-content-center gap-4 p-4">
                        {Array.from({ length: 12 }).map((_, index) => (
                            <div key={`skeleton-${index}`} className="compartment-skeleton" />
                        ))}
                    </div>
                )}
                {error && <div className="text-center py-4" style={{ color: 'var(--red)' }}>Error: {error}</div>}
                {!isLoading && !error && (
                    <div className="tray-content" key={selectedCategory}>
                        <p className="tray-eyebrow text-center mt-3 mb-0">Compartment</p>
                        <h2 className="text-center pt-1 pb-3" style={{ color: 'var(--cheek)' }}>{selectedCategory}</h2>

                        <BrowseContent
                            animeList={animeList}
                            isLoadingMore={isFetching}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Browse;

