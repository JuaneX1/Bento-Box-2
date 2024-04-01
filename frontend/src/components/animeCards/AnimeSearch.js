import React, { useState, useEffect } from 'react';
import '../../css/DashboardPage.css';
import BrowseContent from '../pageFeatures/BrowseContent';

function AnimeSearch({ typeDefault }) {
    const [animeList, setAnimeList] = useState([]);
    const [search, setSearch] = useState("");
    const [animeFound, setAnimeFound] = useState([]);

    useEffect(() => {
        // Fetch top anime if typeDefault is "topAnime"
        if (typeDefault === "topAnime") {
            fetchTopAnime();
        }
    }, [typeDefault]);

    // Debounce function
    const debounce = (func, delay) => {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    };

    // Debounced function for fetching anime
    const debouncedFetchAnime = debounce(async (query) => {
        const temp = await fetch(`https://api.jikan.moe/v4/anime?q=${query}&order_by=title&sort=asc&limit=10&genres_excluded=9,45,12`)
            .then(res => res.json());
        setAnimeList(temp.data);
    }, 1000); // Adjust the delay as needed (1000 milliseconds in this example)

    const fetchTopAnime = async () => {
        const temp = await fetch(`https://api.jikan.moe/v4/top/anime?filter=bypopularity&limit=20&genres_excluded=9,45,12`)
            .then(res => res.json());
        setAnimeFound(temp.data);
    };

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearch(query);
        debouncedFetchAnime(query); // Call the debounced fetch function
    };

    return (
        <div className="content-wrap">
            <BrowseContent
                handleSearchChange={handleSearchChange}
                search={search}
                setSearch={setSearch}
                animeList={search ? animeList : animeFound}
            />
        </div>
    )
}

export default AnimeSearch;
