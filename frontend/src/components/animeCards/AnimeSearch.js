import React, { useState, useEffect } from 'react';
import '../../css/DashboardPage.css';
import BrowseContent from '../pageFeatures/BrowseContent';
import { instance } from '../../App';

function AnimeSearch({ typeDefault }) {
    const [animeList, setAnimeList] = useState([]);
    const [search, setSearch] = useState("");
    const [animeFound, setAnimeFound] = useState([]);
    const [userData, setUserData] = useState('');
    const [error, setError] = useState('');
    useEffect(() => {
		const getUserInfo = async () => {
			try {
				const token = sessionStorage.getItem('token');
				const response = await instance.get(`/info`, { headers: { Authorization: token }});
				setUserData(response.data);
			} catch (error) {
				console.error('Error fetching user info:', error);
				setError('Failed to fetch user information');
			}
		};
		getUserInfo();
	}, []);

    useEffect(() => {
        // Fetch top anime if typeDefault is "topAnime"
        if (typeDefault === "topAnime") {
            fetchTopAnime();
        }
    }, [typeDefault]);

    const fetchAnime = async (query) => {
        const temp = await fetch(`https://api.jikan.moe/v4/anime?q=${query}&sfw&order_by=title&sort=asc&genres_excluded=9,49,12`)
            .then(res => res.json());
        setAnimeList(temp.data);
    };

    const fetchTopAnime = async () => {
        const temp = await fetch(`https://api.jikan.moe/v4/anime?order_by=popularity&genres_exclude=9,49,12&q=`)
            .then(res => res.json());
        setAnimeFound(temp.data);
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission
        fetchAnime(search);
    };

    return (
        <div className="content-wrap">
            <h1>Welcome {userData.first}</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search anime..."
                />
                <button type="submit">Search</button>
            </form>
            <BrowseContent
                animeList={search ? animeList : animeFound}
            />
        </div>
    )
}

export default AnimeSearch;
