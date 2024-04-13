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

    const fetchAnime = async (query) => {
        const temp = await fetch(`https://api.jikan.moe/v4/anime?q=${query}&order_by=title&sort=asc&limit=10&genres_excluded=9,45,12`)
            .then(res => res.json());
        setAnimeList(temp.data);
    };

    const fetchTopAnime = async () => {
        const temp = await fetch(`https://api.jikan.moe/v4/top/anime?filter=bypopularity&limit=20&genres_excluded=9,45,12`)
            .then(res => res.json());
        setAnimeFound(temp.data);
    };

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            fetchAnime(search);
        }, 2000);

        return () => clearTimeout(delaySearch); // Clear the timeout on component unmount or when search changes
    }, [search]);

    return (
        <div className="content-wrap">
            <BrowseContent
                handleSearchChange={(e) => setSearch(e.target.value)}
                search={search}
                setSearch={setSearch}
                animeList={search ? animeList : animeFound}
            />
        </div>
    )
}

export default AnimeSearch;
